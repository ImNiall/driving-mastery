#!/usr/bin/env node
/**
 * Quick setup script for local development environment
 * 
 * Usage:
 * 1. Run: node scripts/quick-setup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask a question and return the answer
const ask = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => {
    resolve(answer);
  });
});

async function setup() {
  console.log('🚀 Quick Setup for Driving Mastery App');
  console.log('--------------------------------------');
  
  // Check if .env already exists
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await ask('⚠️ .env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Your .env file was not modified.');
      rl.close();
      return;
    }
  }
  
  // Get Supabase credentials
  console.log('\n📦 Supabase Configuration');
  const supabaseUrl = await ask('Supabase URL: ');
  const supabaseAnonKey = await ask('Supabase Anon Key: ');
  const supabaseServiceKey = await ask('Supabase Service Role Key: ');
  
  // Get Clerk credentials
  console.log('\n🔐 Clerk Authentication');
  const clerkPublishableKey = await ask('Clerk Publishable Key: ');
  const clerkSecretKey = await ask('Clerk Secret Key: ');
  
  // Create .env file
  const envContent = `# Supabase configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_URL=${supabaseUrl}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Clerk authentication
VITE_CLERK_PUBLISHABLE_KEY=${clerkPublishableKey}
CLERK_SECRET_KEY=${clerkSecretKey}

# App configuration
VITE_SITE_URL=http://localhost:5173
VITE_MINI_QUIZ_COUNT=5
`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env file created successfully!');
  
  console.log('\n🎉 Setup complete! You can now run the app with:');
  console.log('npm run dev');
  
  rl.close();
}

setup();
