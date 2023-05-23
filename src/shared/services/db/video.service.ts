import { IVideoDocument } from '@video/interfaces/videoDocument.interface';
import { VideoSchema } from '@video/models/video.schema';
import mongoose from 'mongoose';

//aqui se implementa principio SOLID open / close y single  responsability, ya que las funcionales de esta clase pueden expanderse en variedad
class VideoService {
  // funcion asincrona para crear un video, es asincrona ya que los metodo de mongoose son asincronos
  public async createVideo(data: IVideoDocument): Promise<void> {
    await VideoSchema.create(data);
    // el metodo "create" es de mongoose,  el permite crear un documento en la DB
  }

  public async getVideoByUserId(userId: string): Promise<IVideoDocument> {
    const user: IVideoDocument[] = await VideoSchema.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'User', localField: 'author', foreignField: '_id', as: 'author' } },
      { $unwind: 'author' },
      { $project: this.aggregateData() }
    ]);

    return user[0];
  }

  public async getVideoByUsername(username: string): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.findOne({ username }).populate([
      { path: 'author', select: 'username createdAt' },
      { path: 'likes', select: 'username createdAt' }
    ])) as IVideoDocument;

    return user;
  }

  // get all videos in the collections
  public async getAllVideos(): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.find().populate([
      { path: 'author', select: 'username createdAt' },
      { path: 'likes', select: 'username createdAt' }
    ])) as unknown as IVideoDocument;
    return user;
  }

  private aggregateData() {
    return {
      _id: 1,
      username: 'author.username',
      createdAt: 'author.createdAt',
      title: 1,
      description: 1,
      link: 1,
      likes: 1,
      category: 1
    };
  }
}

export const videoService: VideoService = new VideoService();
