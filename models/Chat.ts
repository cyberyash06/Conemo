import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IChat extends Document {
  users: mongoose.Types.ObjectId[];
  mood: string;
  startedAt: Date;
  endedAt?: Date;
  expiresAt: Date;
}

const chatSchema = new Schema<IChat>({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  mood: {
    type: String,
    required: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '0s' }, // TTL index
  },
});

export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);
