import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    streamUrl: {
      type: String,
      required: true,
    },
    streamType: {
      type: String,
      enum: ['Auto', 'HLS', 'TS', 'MP4', 'DASH'],
      default: 'Auto',
    },
    status: {
      type: String,
      enum: ['Live', 'Offline'],
      default: 'Live',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Channel || mongoose.model('Channel', ChannelSchema);
