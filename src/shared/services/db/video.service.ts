import { IVideoDocument } from '@video/interfaces/videoDocument.interface';
import { VideoSchema } from '@video/models/video.schema';
import mongoose from 'mongoose';

// In this file was implemented  Principle SOLID open / close and Design Patern single  responsability
class VideoService {
  public async createVideo(data: IVideoDocument): Promise<void> {
    await VideoSchema.create(data);
  }

  public async getVideoByUserId(authorId: string): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.findOne({ author: new mongoose.Types.ObjectId(authorId) }).populate(
      [
        { path: 'author', select: 'username createdAt' },
        { path: 'likes', select: 'username createdAt' }
      ]
    )) as IVideoDocument;
    return user;
  }

  public async getVideoByUsername(username: string): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.findOne({ username }).populate([
      { path: 'author', select: 'username createdAt' },
      { path: 'likes', select: 'username createdAt' }
    ])) as IVideoDocument;

    return user;
  }

  public async getVideoById(idVideo: string): Promise<IVideoDocument> {
    const video: IVideoDocument = (await VideoSchema.findById({ _id: idVideo }).populate([
      { path: 'author', select: 'username' },
      { path: 'likes', select: 'username' }
    ])) as IVideoDocument;

    return video;
  }

  public async getAllVideos(): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.find().populate([
      { path: 'author', select: 'username createdAt' },
      { path: 'likes', select: 'username createdAt' }
    ])) as unknown as IVideoDocument;
    return user;
  }
}

export const videoService: VideoService = new VideoService();
