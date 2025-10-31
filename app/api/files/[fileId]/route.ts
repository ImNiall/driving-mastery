import type { NextRequest } from "next/server";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: { fileId: string } },
) {
  const [file, content] = await Promise.all([
    openai.files.retrieve(params.fileId),
    openai.files.content(params.fileId),
  ]);

  return new Response(content.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    },
  });
}
