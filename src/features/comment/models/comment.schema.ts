import { model, Model, Schema } from 'mongoose';
import mongoose from 'mongoose';
import { ICommentDocument } from '@comment/interfaces/commentDocument.interface';

const commentSchema: Schema = new Schema({
  idVideo: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  idAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now() }
});

const CommentSchema: Model<ICommentDocument> = model<ICommentDocument>('Comment', commentSchema, 'Comment');
export { CommentSchema };
