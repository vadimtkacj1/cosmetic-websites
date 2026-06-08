import { NextRequest, NextResponse } from 'next/server';

const LEAD_API = 'https://aiterra.agency/api/site-leads/submit';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
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
    console.error('[lead] upstream fetch failed:', err);
    return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
  }
}
