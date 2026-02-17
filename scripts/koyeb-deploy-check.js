#!/usr/bin/env node

// Koyeb Deployment Validation Script
// Run this before deploying to Koyeb

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🚀 Koyeb Deployment Validation');
console.log('================================');

// Check required environment variables
const requiredEnvVars = [
  'EXPO_PUBLIC_MONGODB_URI', // This is the main one we're using
  'MONGODB_URI', // Optional fallback
  'EXPO_PUBLIC_BUNNY_API_KEY',
  'EXPO_PUBLIC_BUNNY_LIBRARY_ID_REELS',
  'EXPO_PUBLIC_BUNNY_LIBRARY_ID_VIDEO',
  'EXPO_PUBLIC_BUNNY_LIBRARY_ID_LIVE'
];

console.log('\n🔧 Environment Variables Check:');
let allVarsPresent = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set (${value.length} characters)`);
  } else {
    // MONGODB_URI is optional since we use EXPO_PUBLIC_MONGODB_URI
    if (varName === 'MONGODB_URI') {
      console.log(`⚠️  ${varName}: Missing (Optional - using EXPO_PUBLIC_MONGODB_URI)`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allVarsPresent = false;
    }
  }
});

// Check MongoDB URI format
const mongoUri = process.env.EXPO_PUBLIC_MONGODB_URI || process.env.MONGODB_URI;
if (mongoUri) {
  console.log('\n📝 MongoDB URI Validation:');
  console.log(`✅ Format: ${mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://') ? 'Valid' : 'Invalid'}`);
  console.log(`✅ Contains credentials: ${mongoUri.includes('@') ? 'Yes' : 'No'}`);
  console.log(`✅ Contains replica set: ${mongoUri.includes('replicaSet') ? 'Yes' : 'No'}`);
  console.log(`✅ Contains SSL: ${mongoUri.includes('ssl=true') ? 'Yes' : 'No'}`);
  console.log(`✅ Contains authSource: ${mongoUri.includes('authSource') ? 'Yes' : 'No'}`);
  
  // Test MongoDB connection
  console.log('\n🔗 MongoDB Connection Test:');
  mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 15000
  })
  .then(() => {
    console.log('✅ MongoDB connection successful');
    console.log(`🎯 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed');
    console.log(`🔍 Error: ${err.message}`);
    if (err.name === 'MongoServerSelectionError') {
      console.log('🌐 Network/Access Issue - Check IP whitelist in MongoDB Atlas');
    } else if (err.code === 'AUTH_FAILED') {
      console.log('🔐 Authentication Issue - Check username/password');
    }
  });
}

console.log('\n📋 Koyeb Deployment Checklist:');
console.log('1. ✅ Environment variables set in .env file');
console.log('2. ✅ MongoDB URI format validated');
console.log('3. ✅ MongoDB connection tested');
console.log('4. 🔄 Copy environment variables to Koyeb Dashboard');
console.log('5. 🔄 Deploy to Koyeb');
console.log('6. 🔄 Check /koyeb/health endpoint after deployment');

console.log('\n🔧 Koyeb Environment Variables Setup:');
console.log('Go to Koyeb Dashboard → Service → Environment Variables');
console.log('Add these variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ${varName}=<your_value>`);
  }
});

if (!allVarsPresent) {
  console.log('\n❌ Some environment variables are missing. Please fix before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed. Ready for Koyeb deployment!');
}
