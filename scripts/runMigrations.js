// Simple helper that prints instructions for running migrations on Supabase.
// Supabase free tier doesn't give direct psql access by default from Node easily,
// so the simplest free approach is to paste each migration file into the
// Supabase Dashboard -> SQL Editor and run it, in order (001, 002, 003...).
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../database/migrations');
const files = fs.readdirSync(migrationsDir).sort();

console.log('Run these files IN ORDER in your Supabase project\'s SQL Editor:');
files.forEach((f) => console.log(' -', f));
console.log('\nThen run database/seeds/seed.sql to add sample data.');
