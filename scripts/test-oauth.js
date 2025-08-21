#!/usr/bin/env node

/**
 * OAuth Configuration Test Script
 * 
 * This script helps verify that your OAuth providers are properly configured
 * for the h2jaan.online domain.
 */

import https from 'https';
import http from 'http';

const DOMAIN = 'https://www.h2jaan.online';
const SUPABASE_URL = 'https://zjxksrybibrxqlobnuyb.supabase.co';

console.log('🔍 Testing OAuth Configuration for h2jaan.online\n');

// Test 1: Check if domain is accessible
async function testDomainAccess() {
  console.log('1. Testing domain accessibility...');
  
  try {
    const response = await new Promise((resolve, reject) => {
      https.get(DOMAIN, (res) => {
        resolve(res);
      }).on('error', (err) => {
        reject(err);
      });
    });
    
    console.log(`✅ Domain is accessible (Status: ${response.statusCode})`);
    return true;
  } catch (error) {
    console.log(`❌ Domain is not accessible: ${error.message}`);
    return false;
  }
}

// Test 2: Check Supabase connectivity
async function testSupabaseConnection() {
  console.log('\n2. Testing Supabase connectivity...');
  
  try {
    const response = await new Promise((resolve, reject) => {
      https.get(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeGtzcnliaWJyeHFsb2JudXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODY5NzIsImV4cCI6MjA3MTM2Mjk3Mn0.z2YAPYM2yPOC2MDs21CiCAYreJiQonW38UGmsWZbZms'
        }
      }, (res) => {
        resolve(res);
      }).on('error', (err) => {
        reject(err);
      });
    });
    
    console.log(`✅ Supabase is accessible (Status: ${response.statusCode})`);
    return true;
  } catch (error) {
    console.log(`❌ Supabase is not accessible: ${error.message}`);
    return false;
  }
}

// Test 3: Check OAuth endpoints
async function testOAuthEndpoints() {
  console.log('\n3. Testing OAuth endpoints...');
  
  const endpoints = [
    `${SUPABASE_URL}/auth/v1/authorize`,
    `${SUPABASE_URL}/auth/v1/callback`,
    `${DOMAIN}/login`,
    `${DOMAIN}/auth/callback`
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await new Promise((resolve, reject) => {
        const url = new URL(endpoint);
        const client = url.protocol === 'https:' ? https : http;
        
        client.get(endpoint, (res) => {
          resolve(res);
        }).on('error', (err) => {
          reject(err);
        });
      });
      
      console.log(`✅ ${endpoint} (Status: ${response.statusCode})`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Test 4: Display configuration checklist
function displayChecklist() {
  console.log('\n4. Configuration Checklist:');
  console.log('\n📋 Supabase Dashboard Configuration:');
  console.log('   □ Go to Authentication > URL Configuration');
  console.log('   □ Set Site URL to: https://www.h2jaan.online');
  console.log('   □ Add redirect URLs:');
  console.log('     - https://www.h2jaan.online');
  console.log('     - https://www.h2jaan.online/');
  console.log('     - https://www.h2jaan.online/auth/callback');
  console.log('     - https://www.h2jaan.online/login');
  console.log('     - https://www.h2jaan.online/signup');
  console.log('     - https://www.h2jaan.online/profile');
  
  console.log('\n📋 Google OAuth Configuration:');
  console.log('   □ Create OAuth 2.0 credentials in Google Cloud Console');
  console.log('   □ Add authorized redirect URIs:');
  console.log('     - https://zjxksrybibrxqlobnuyb.supabase.co/auth/v1/callback');
  console.log('     - https://www.h2jaan.online/auth/callback');
  console.log('     - https://www.h2jaan.online');
  console.log('   □ Add authorized JavaScript origins:');
  console.log('     - https://www.h2jaan.online');
  console.log('     - https://zjxksrybibrxqlobnuyb.supabase.co');
  console.log('   □ Enable Google provider in Supabase');
  console.log('   □ Enter Client ID and Client Secret');
  
  console.log('\n📋 GitHub OAuth Configuration:');
  console.log('   □ Create OAuth App in GitHub Developer Settings');
  console.log('   □ Set Homepage URL to: https://www.h2jaan.online');
  console.log('   □ Set Authorization callback URL to: https://zjxksrybibrxqlobnuyb.supabase.co/auth/v1/callback');
  console.log('   □ Enable GitHub provider in Supabase');
  console.log('   □ Enter Client ID and Client Secret');
  
  console.log('\n📋 Security Settings:');
  console.log('   □ Enable email confirmations');
  console.log('   □ Enable email change confirmations');
  console.log('   □ Enable secure email change');
  console.log('   □ Review rate limiting settings');
}

// Test 5: Display next steps
function displayNextSteps() {
  console.log('\n5. Next Steps:');
  console.log('\n🚀 After completing the configuration:');
  console.log('   1. Test Google OAuth:');
  console.log('      - Go to https://www.h2jaan.online/login');
  console.log('      - Click "Continue with Google"');
  console.log('      - Verify redirect and authorization flow');
  
  console.log('\n   2. Test GitHub OAuth:');
  console.log('      - Go to https://www.h2jaan.online/login');
  console.log('      - Click "Continue with GitHub"');
  console.log('      - Verify redirect and authorization flow');
  
  console.log('\n   3. Test user profile creation:');
  console.log('      - Complete OAuth sign-in');
  console.log('      - Verify profile is created in database');
  console.log('      - Test profile setup flow');
  
  console.log('\n   4. Test sign out:');
  console.log('      - Sign in via OAuth');
  console.log('      - Click sign out');
  console.log('      - Verify session is cleared');
  
  console.log('\n🔧 Troubleshooting:');
  console.log('   - Check browser console for errors');
  console.log('   - Verify Supabase logs in dashboard');
  console.log('   - Ensure all redirect URLs match exactly');
  console.log('   - Check CORS settings in OAuth providers');
}

// Run all tests
async function runTests() {
  await testDomainAccess();
  await testSupabaseConnection();
  await testOAuthEndpoints();
  displayChecklist();
  displayNextSteps();
  
  console.log('\n✨ OAuth Configuration Test Complete!');
  console.log('\n📖 For detailed setup instructions, see: OAUTH_SETUP_GUIDE.md');
}

// Run the tests
runTests().catch(console.error);
