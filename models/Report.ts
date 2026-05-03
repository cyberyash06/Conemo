import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  reportedUserId: mongoose.Types.ObjectId;
  chatId: mongoose.Types.ObjectId;
  reason: string;
  createdAt: Date;
}

const reportSchema = new Schema<IReport>({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 21600 }, // Auto-delete after 6 hours
  },
});

export const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema);
