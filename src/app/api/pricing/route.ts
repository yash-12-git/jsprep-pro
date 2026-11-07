// api/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getBilledPricing } from '@/lib/pricing'

export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry')
  return NextResponse.json(getBilledPricing(country))
}