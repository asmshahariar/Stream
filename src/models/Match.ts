import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMatch extends Document {
  league: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  date: string;
  time: string;
  location: string;
  status: 'Latest' | 'Upcoming';
  countdown: string;
  channelId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const matchSchema = new Schema<IMatch>({
  league: { type: String, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  team1Flag: { type: String, required: true },
  team2Flag: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Latest', 'Upcoming'], default: 'Upcoming' },
  countdown: { type: String, default: '' },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: false },
}, {
  timestamps: true,
});

const Match: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', matchSchema);

export default Match;
