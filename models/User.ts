import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  createdAt: Date;
  lastActive: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
    index: { expires: 21600 }, // Auto-delete 6 hours after last activity
  },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
