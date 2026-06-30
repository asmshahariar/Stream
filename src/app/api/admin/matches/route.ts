import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Match from '@/models/Match';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    await connectToDatabase();
    const matches = await Match.find({}).sort({ createdAt: -1 });
    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    await connectToDatabase();
    const match = await Match.create(body);
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}
