#!/usr/bin/env node
/**
 * Run this script locally to apply the storage policy SQL as the DB owner.
 *
 * Usage:
 *   1. Install dependency: npm install pg
 *   2. Get your Postgres connection string from Supabase Dashboard -> Settings -> Database -> Connection string
 *   3. Run:
 *      setx SUPABASE_DB_CONNECTION "postgres://..."  (Windows PowerShell)
 *      $env:SUPABASE_DB_CONNECTION = 'postgres://...'
 *      node scripts/apply_storage_policies.js
 *
 * Important: keep your connection string secret. Do NOT commit it to source control.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';

async function main() {
  const conn = process.env.SUPABASE_DB_CONNECTION;
  if (!conn) {
    console.error('ERROR: SUPABASE_DB_CONNECTION environment variable is not set.');
    console.error('Get the Postgres connection string from Supabase Dashboard -> Settings -> Database -> Connection string');
    process.exit(1);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sqlPath = path.resolve(__dirname, '..', 'supabase', 'storage.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('ERROR: storage.sql not found at', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new Client({ connectionString: conn });
  try {
    await client.connect();
    console.log('Connected to Postgres. Ensuring `documents` bucket exists...');

    // Create the storage bucket directly as DB owner.
    // This avoids the missing `storage.create_bucket` SQL function problem.
    await client.query(
      `INSERT INTO storage.buckets (id, name, public)
       VALUES ($1, $1, $2)
       ON CONFLICT (id) DO NOTHING`,
      ['documents', true]
    );

    console.log('Bucket ensured. Applying storage policies...');

    // Execute the SQL file content for policies / RLS.
    await client.query(sql);
    console.log('Policies applied successfully.');
  } catch (err) {
    console.error('Failed to apply policies:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
