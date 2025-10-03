#!/usr/bin/env node
/**
 * Setup script for local development environment
 * 
 * Usage:
 * 1. Run: node scripts/setup-dev.js
 * 2. Follow the prompts to create your .env file
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const rootDir = path.join(__dirname, '..');
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️ .env file already exists.');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Your .env file was not modified.');
      rl.close();
      return;
    }
    createEnvFile();
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  // Read .env.example
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  const envLines = envExample.split('\n');
  const envVars = {};
  
  // Extract variable names
  const varPromises = [];
  for (const line of envLines) {
    if (line.trim() === '' || line.startsWith('#')) continue;
    
    const [key, defaultValue] = line.split('=');
    if (!key) continue;
    
    varPromises.push(
      new Promise((resolve) => {
        rl.question(`Enter value for ${key} (default: ${defaultValue}): `, (answer) => {
          envVars[key] = answer || defaultValue;
          resolve();
        });
      })
    );
  }
  
  // After all variables are collected
  Promise.all(varPromises).then(() => {
    // Create .env file
    let envContent = '';
    for (const line of envLines) {
      if (line.trim() === '' || line.startsWith('#')) {
        envContent += line + '\n';
        continue;
      }
      
      const key = line.split('=')[0];
      if (!key || !envVars[key]) {
        envContent += line + '\n';
        continue;
      }
      
      envContent += `${key}=${envVars[key]}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    
    // Ask if user wants to set up Supabase
    rl.question('Do you want to set up the Supabase database now? (y/N): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('🔄 Setting up Supabase...');
        exec('node scripts/setup-supabase.js', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Error setting up Supabase:', error);
            rl.close();
            return;
          }
          
          console.log(stdout);
          console.log('🎉 Setup complete! You can now run the app with:');
          console.log('npm run dev');
          rl.close();
        });
      } else {
        console.log('🎉 Setup complete! You can now run the app with:');
        console.log('npm run dev');
        rl.close();
      }
    });
  });
}
