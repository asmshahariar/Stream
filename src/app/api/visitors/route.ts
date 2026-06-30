import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Visitor from '@/models/Visitor';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Parse body for visitorId
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    // Get IP from headers as fallback
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    let ip = forwardedFor ? forwardedFor.split(',')[0] : realIp;
    
    if (!ip) {
      ip = 'unknown';
    }

    const visitorIdentifier = body.visitorId || ip;

    // Update or create visitor
    await Visitor.findOneAndUpdate(
      { ip: visitorIdentifier },
      { lastActive: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record visitor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get stats
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const online = await Visitor.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });
    const today = await Visitor.countDocuments({ lastActive: { $gte: startOfDay } });
    const total = await Visitor.countDocuments();

    return NextResponse.json({ online, today, total });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visitor stats' }, { status: 500 });
  }
}
