import { model, Model, Schema } from 'mongoose';
import mongoose from 'mongoose';
import { IVideoDocument } from '@video/interfaces/videoDocument.interface';

const videoSchema: Schema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, red: 'User' }],
  category: { type: String, default: '' }
});

const VideoSchema: Model<IVideoDocument> = model<IVideoDocument>('Video', videoSchema, 'Video');
export { VideoSchema };
