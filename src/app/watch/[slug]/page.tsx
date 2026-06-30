import connectToDatabase from '@/lib/mongodb';
import Channel from '@/models/Channel';
import Category from '@/models/Category';
import Player from '@/components/Player';
import ChannelCard from '@/components/ChannelCard';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const channel = await Channel.findOne({ slug });
  if (!channel) return { title: 'Not Found' };
  return { title: `${channel.name} | Live TV Streaming` };
}

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const channel = await Channel.findOne({ slug }).populate('category').lean();
  
  if (!channel) {
    notFound();
  }

  // Fetch related channels (same category, exclude current)
  let relatedChannels = [];
  if (channel.category) {
    relatedChannels = await Channel.find({ 
      category: channel.category._id, 
      _id: { $ne: channel._id } 
    }).limit(4).lean();
  }

  const serializeChannel = (c: any) => ({
    ...c,
    _id: c._id.toString(),
    category: c.category ? { ...c.category, _id: c.category._id.toString() } : null
  });

  const serializedChannel = serializeChannel(channel);
  const serializedRelated = relatedChannels.map(serializeChannel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player Area */}
        <div className="lg:col-span-2 space-y-6">
          <Player 
            src={serializedChannel.streamUrl} 
            type={serializedChannel.streamType} 
          />
          
          <div className="bg-card p-6 rounded-xl border border-gray-800">
            <div className="flex items-start gap-4">
              {serializedChannel.logo && (
                <img 
                  src={serializedChannel.logo} 
                  alt={serializedChannel.name} 
                  className="w-20 h-20 object-contain bg-gray-900 rounded p-2"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{serializedChannel.name}</h1>
                  {serializedChannel.status === 'Live' && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LIVE
                    </span>
                  )}
                </div>
                {serializedChannel.category && (
                  <span className="text-primary font-medium px-3 py-1 bg-primary/10 rounded-full text-sm">
                    {serializedChannel.category.name}
                  </span>
                )}
                <p className="mt-4 text-gray-400">
                  {serializedChannel.description || 'No description available for this channel.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Related */}
        <div>
          <h3 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Related Channels</h3>
          {serializedRelated.length > 0 ? (
            <div className="space-y-4">
              {serializedRelated.map(related => (
                <ChannelCard key={related._id} channel={related} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No related channels found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
