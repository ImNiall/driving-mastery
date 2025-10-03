<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1sy6YZvCaubP42EFk-hO7ap3On-AcnmiD

## Run Locally

**Prerequisites:**
- Node.js (v16+)
- Supabase account (free tier works fine)
- Clerk account for authentication

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   node scripts/setup-dev.js
   ```
   This interactive script will guide you through creating your `.env` file with all necessary credentials.

3. **Set up Supabase database:**
   ```bash
   node scripts/setup-supabase.js
   ```
   This will create the required tables in your Supabase instance.

4. **Run the app:**
   ```bash
   npm run dev
   ```

### Manual Setup

If you prefer to set up manually:

1. Copy `.env.example` to `.env`
2. Fill in your Supabase, Clerk, and OpenAI credentials
3. Run `node scripts/setup-supabase.js` to set up the database
4. Run `npm run dev` to start the app
