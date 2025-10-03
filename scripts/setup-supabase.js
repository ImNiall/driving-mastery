#!/usr/bin/env node
/**
 * Setup script for Supabase quiz_sessions table
 * 
 * Usage:
 * 1. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in your .env file
 * 2. Run: node scripts/setup-supabase.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL migration file
const sqlPath = path.join(__dirname, '..', 'docs', 'supabase', 'migrations', '20251003_quiz_sessions.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

async function setupSupabase() {
  console.log('🔄 Setting up Supabase quiz_sessions table...');
  
  try {
    // Execute SQL
    const { error } = await supabase.rpc('pgclient_exec', { query: sql });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      process.exit(1);
    }
    
    console.log('✅ Successfully set up quiz_sessions table!');
    
    // Test connection
    const { data, error: testError } = await supabase
      .from('quiz_sessions')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error testing connection:', testError);
      process.exit(1);
    }
    
    console.log('✅ Connection test successful!');
    console.log('🎉 Your Supabase setup is complete and ready to use.');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

setupSupabase();
