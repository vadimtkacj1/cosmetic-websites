import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getSalonDataDir } from '@/lib/salon-data-dir';

const LEAD_API = 'https://aiterra.agency/api/site-leads/submit';

interface LeadBody {
  publicToken?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  source?: string;
}

async function saveLocalFallback(body: LeadBody): Promise<void> {
  const dataDir = getSalonDataDir();
  const filePath = path.join(dataDir, 'site-leads-fallback.json');
  await mkdir(dataDir, { recursive: true });
  let leads: unknown[] = [];
  try { leads = JSON.parse(await readFile(filePath, 'utf-8')); } catch { leads = []; }
  leads.unshift({ ...body, savedAt: new Date().toISOString(), _fallback: true });
  await writeFile(filePath, JSON.stringify(leads, null, 2));
}

export async function POST(req: NextRequest) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }

  try {
    const res = await fetch(LEAD_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[lead] aiterra unreachable, saving locally:', err);
    try {
      await saveLocalFallback(body);
    } catch (fsErr) {
      console.error('[lead] local fallback also failed:', fsErr);
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  }
}
