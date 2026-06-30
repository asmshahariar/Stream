import connectToDatabase from '@/lib/mongodb';
import Channel from '@/models/Channel';
import Category from '@/models/Category';
import ChannelCard from '@/components/ChannelCard';
import { notFound } from 'next/navigation';
import { Tv } from 'lucide-react';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const category = await Category.findOne({ slug }).lean();
  
  if (!category) {
    notFound();
  }

  const channels = await Channel.find({ category: category._id }).populate('category').sort({ createdAt: -1 }).lean();

  const serializeChannel = (c: any) => ({
    ...c,
    _id: c._id.toString(),
    category: c.category ? { ...c.category, _id: c.category._id.toString() } : null
  });

  const serializedChannels = channels.map(serializeChannel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center gap-3">
          <Tv className="w-8 h-8 text-primary" />
          {category.name} Channels
        </h1>
        <p className="text-gray-400 text-lg">Browse all channels in the {category.name} category.</p>
      </div>

      {serializedChannels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serializedChannels.map(channel => (
            <ChannelCard key={channel._id} channel={channel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border border-gray-800">
          <h3 className="text-2xl font-semibold mb-2">No channels found</h3>
          <p className="text-gray-500">There are currently no channels available in this category.</p>
        </div>
      )}
    </div>
  );
}
