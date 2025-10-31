import { NextRequest, NextResponse } from "next/server";
import type { VectorStoreFile } from "openai/resources/vector-stores/files";
import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!assistantId) {
    return NextResponse.json(
      { error: "Assistant is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const vectorStoreId = await getOrCreateVectorStore();

  const uploaded = await openai.files.create({
    file,
    purpose: "assistants",
  });

  await openai.vectorStores.files.create(vectorStoreId, {
    file_id: uploaded.id,
  });

  return new Response(null, { status: 201 });
}

export async function GET() {
  if (!assistantId) {
    return NextResponse.json(
      { error: "Assistant is not configured." },
      { status: 500 },
    );
  }

  const vectorStoreId = await getOrCreateVectorStore();
  const list = await openai.vectorStores.files.list(vectorStoreId);

  const files = await Promise.all(
    list.data.map(async (entry: VectorStoreFile) => {
      const [details, vectorDetails] = await Promise.all([
        openai.files.retrieve(entry.id),
        openai.vectorStores.files.retrieve(vectorStoreId, entry.id),
      ]);
      return {
        file_id: entry.id,
        filename: details.filename,
        status: vectorDetails.status,
      };
    }),
  );

  return NextResponse.json(files);
}

export async function DELETE(request: NextRequest) {
  if (!assistantId) {
    return NextResponse.json(
      { error: "Assistant is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const fileId = typeof body?.fileId === "string" ? body.fileId : "";
  if (!fileId) {
    return NextResponse.json({ error: "fileId required" }, { status: 400 });
  }

  const vectorStoreId = await getOrCreateVectorStore();
  await openai.vectorStores.files.del(vectorStoreId, fileId);

  return new Response(null, { status: 204 });
}

async function getOrCreateVectorStore(): Promise<string> {
  if (!assistantId) {
    throw new Error("Assistant is not configured.");
  }

  const assistant = await openai.beta.assistants.retrieve(assistantId);
  const existing =
    assistant.tool_resources?.file_search?.vector_store_ids?.[0] ?? null;
  if (existing) return existing;

  const vectorStore = await openai.vectorStores.create({
    name: "driving-mastery-assistant",
  });

  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: { vector_store_ids: [vectorStore.id] },
    },
  });

  return vectorStore.id;
}
