import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Match from '@/models/Match';
import { getServerSession } from 'next-auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();
    
    const match = await Match.findByIdAndUpdate(id, body, { new: true });
    if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    
    return NextResponse.json(match);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    
    const match = await Match.findByIdAndDelete(id);
    if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    
    return NextResponse.json({ message: 'Match deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 });
  }
}
