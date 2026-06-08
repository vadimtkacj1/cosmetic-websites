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

async function saveLocally(body: LeadBody): Promise<void> {
  const dataDir = getSalonDataDir();
  const filePath = path.join(dataDir, 'site-leads.json');
  await mkdir(dataDir, { recursive: true });
  let leads: unknown[] = [];
  try {
    leads = JSON.parse(await readFile(filePath, 'utf-8'));
  } catch {
    leads = [];
  }
  leads.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...body,
    createdAt: new Date().toISOString(),
  });
  await writeFile(filePath, JSON.stringify(leads, null, 2));
}

async function forwardToAiterra(body: LeadBody): Promise<void> {
  const res = await fetch(LEAD_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.warn('[lead] aiterra returned', res.status);
  }
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
    await saveLocally(body);
  } catch (err) {
    console.error('[lead] local save failed:', err);
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }

  // best-effort — don't block the response if aiterra is down
  forwardToAiterra(body).catch((err) =>
    console.warn('[lead] aiterra forward failed:', err)
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
