import { Document } from 'mongoose';
import { Image } from './image';

export interface Photographer extends Document {
  full_name: string;
  avatar_url?: string;
  avatar_public_id?: string;
  instagram?: string;
  user_name: string;
  status: boolean;
  images?: Image[];
}
