import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
  replyTo?: {
    messageId: string;
    text: string;
    senderId: string;
  };
}

const messageSchema = new Schema<IMessage>({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  replyTo: {
    messageId: String,
    text: String,
    senderId: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: { expires: 21600 }, // Auto-delete after 6 hours
  },
});

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
