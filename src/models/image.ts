import { model, Schema } from 'mongoose';
import { Image } from '../types/image';

const imageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true, unique: true },
    public_id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default model<Image>('Image', imageSchema);
