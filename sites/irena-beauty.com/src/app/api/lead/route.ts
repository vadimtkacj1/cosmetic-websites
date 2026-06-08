import { NextRequest, NextResponse } from 'next/server';

const LEAD_API = 'https://aiterra.agency/api/site-leads/submit';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(LEAD_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
