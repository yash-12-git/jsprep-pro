// api/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPricingForCountry } from '@/lib/pricing'

export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry')
  return NextResponse.json(getPricingForCountry(country))
}