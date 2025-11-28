// Import bookings from Airtable to Vercel Postgres
// Run with: npx tsx scripts/import-from-airtable.ts

import { sql } from '@vercel/postgres';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

interface AirtableRecord {
  id: string;
  fields: {
    Vorname?: string;
    Nachname?: string;
    Telefon?: string;
    Email?: string;
    Leistung?: string;
    Wunschtermin?: string;
    Wunschuhrzeit?: string;
    Nachricht?: string;
    Status?: string;
    'Submitted At'?: string;
  };
  createdTime: string;
}

async function fetchAirtableRecords(): Promise<AirtableRecord[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    throw new Error('Missing Airtable credentials');
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

  console.log('📥 Fetching records from Airtable...');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Found ${data.records.length} records in Airtable`);

  return data.records;
}

async function importToPostgres(records: AirtableRecord[]) {
  console.log('💾 Importing to Postgres...');

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const record of records) {
    try {
      const fields = record.fields;

      // Skip if no name or phone
      if (!fields.Vorname || !fields.Telefon) {
        console.log(`⏭️  Skipping record without name/phone:`, record.id);
        skipped++;
        continue;
      }

      // Determine status
      let status = 'pending';
      if (fields.Status) {
        const statusLower = fields.Status.toLowerCase();
        if (statusLower.includes('confirm') || statusLower.includes('bestätigt')) {
          status = 'confirmed';
        } else if (statusLower.includes('reject') || statusLower.includes('abgelehnt')) {
          status = 'rejected';
        } else if (statusLower.includes('cancel') || statusLower.includes('storniert')) {
          status = 'cancelled';
        }
      }

      // Parse date
      let wunschtermin = null;
      if (fields.Wunschtermin) {
        try {
          wunschtermin = new Date(fields.Wunschtermin).toISOString().split('T')[0];
        } catch {
          console.warn(`⚠️  Invalid date for record ${record.id}: ${fields.Wunschtermin}`);
        }
      }

      // Insert into database
      await sql`
        INSERT INTO bookings (
          vorname, nachname, telefon, email, leistung,
          wunschtermin, wunschuhrzeit, nachricht, status, created_at
        )
        VALUES (
          ${fields.Vorname},
          ${fields.Nachname || ''},
          ${fields.Telefon},
          ${fields.Email || null},
          ${fields.Leistung || ''},
          ${wunschtermin},
          ${fields.Wunschuhrzeit || ''},
          ${fields.Nachricht || ''},
          ${status},
          ${fields['Submitted At'] || record.createdTime}
        )
      `;

      console.log(`✅ Imported: ${fields.Vorname} ${fields.Nachname || ''} (${status})`);
      imported++;
    } catch (error) {
      console.error(`❌ Error importing record ${record.id}:`, error);
      errors++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
}

async function main() {
  try {
    console.log('🚀 Starting Airtable → Postgres import\n');

    // Fetch records from Airtable
    const records = await fetchAirtableRecords();

    // Import to Postgres
    await importToPostgres(records);

    console.log('\n✅ Import completed!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
