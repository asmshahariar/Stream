import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Channel from '@/models/Channel';
import Category from '@/models/Category'; // Need to register it for populate

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    
    await connectToDatabase();
    
    let filter = {};
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter = { category: category._id };
      } else {
        return NextResponse.json([]); // Return empty if category not found
      }
    }
    
    const channels = await Channel.find(filter).populate('category').sort({ createdAt: -1 });
    return NextResponse.json(channels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const channel = await Channel.create(body);
    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 });
  }
}
