# Assistant Integration Guide

This guide explains how the Driving Mastery AI mentor connects to OpenAI Assistants and Supabase.

## Prerequisites

- Environment variables in `.env` or platform settings:
  - `OPENAI_API_KEY`
  - `ASSISTANT_ID`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Supabase RPC `get_weakest_category(user_uuid uuid)` already created.

## Server utilities

- `lib/supabase/admin.ts` provides a service-role Supabase client for server-side calls.
- `lib/supabase/route.ts` exposes `supabaseRoute()` for authenticated route handlers if needed.

## Assistant tool handling

- `lib/services/assistantTools.ts` implements tool handlers. Currently supported:
  - `getWeakestCategory(userId: string)` → `{ dvsa_category, average_score }`
- Add new tools by extending the `toolHandlers` map.

- `lib/services/assistants.ts` now processes OpenAI `requires_action` tool calls by delegating to the handlers and submitting tool outputs back to the Assistant run.

## API endpoints

- `/api/assistant-chat` is the entry point used by `components/ChatWindow.tsx`. It creates/sends messages through the Assistant and now supports tool calls transparently.

## Configuring the Assistant (OpenAI dashboard)

1. In the Assistants UI, add a function definition matching the tool schema, for example:
   ```json
   {
     "name": "getWeakestCategory",
     "description": "Return the DVSA category the user struggles with most",
     "strict": true,
     "parameters": {
       "type": "object",
       "properties": {
         "userId": { "type": "string", "description": "UUID of the user" }
       },
       "required": ["userId"]
     }
   }
   ```
2. Ensure the Assistant is allowed to return JSON tool outputs.
3. Deploy your backend so `/api/assistant-chat` can be reached from the client.

## Testing

- Run `npm run lint` locally.
- Use the OpenAI Assistants playground to send a message that triggers the function (e.g., "Which DVSA topic am I weakest in?"), passing the user UUID.
- Verify the response returns structured data and the chat displays a helpful message.

## Extending

- Create additional RPCs or Supabase queries.
- Add new handlers in `assistantTools.ts` and register them in the `toolHandlers` map.
- Update function definitions in the Assistants dashboard accordingly.
