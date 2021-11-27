import { model, Schema } from 'mongoose';
import { Photographer } from '../types/photographer';

const photographerSchema: Schema = new Schema(
  {
    full_name: { type: String, required: true },
    avatar_url: { type: String, unique: true },
    avatar_public_id: { type: String, unique: true },
    instagram: { type: String },
    user_name: { type: String, required: true, unique: true },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
    status: { type: Boolean, default: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default model<Photographer>('Photographer', photographerSchema);
