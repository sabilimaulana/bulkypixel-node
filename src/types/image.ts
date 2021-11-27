import { Photographer } from './photographer';

export interface Image extends Document {
  title: string;
  description?: string;
  url: string;
  public_id: string;
  photographer?: Photographer | string;
  slug?: string;
  status: boolean;
}
