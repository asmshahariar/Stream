import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Channel from '@/models/Channel';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const channel = await Channel.findById(id).populate('category');
    if (!channel) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(channel);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch channel' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const body = await request.json();
    const channel = await Channel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!channel) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(channel);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update channel' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const channel = await Channel.findByIdAndDelete(id);
    if (!channel) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete channel' }, { status: 500 });
  }
}
