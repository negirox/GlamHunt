import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  const csvPath = path.join(process.cwd(), '/', 'registrations.csv');
  const csv = fs.readFileSync(csvPath, 'utf8');
  const { data } = Papa.parse(csv, { header: true });
  return NextResponse.json(data);
}