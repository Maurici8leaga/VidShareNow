import { IVideoDocument } from '@video/interfaces/videoDocument.interface';
import { VideoSchema } from '@video/models/video.schema';

//aqui se implementa principio SOLID open / close y single  responsability, ya que las funcionales de esta clase pueden expanderse en variedad
class VideoService {
  // funcion asincrona para crear un video, es asincrona ya que los metodo de mongoose son asincronos
  public async createVideo(data: IVideoDocument): Promise<void> {
    await VideoSchema.create(data);
    // el metodo "create" es de mongoose,  el permite crear un documento en la DB
  }

  // get video by userId
  public async getVideoByUserId(userId: string): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.findById({ userId }).populate([
      // se debe popular el author y likes ya que estas son conexiones con otra coleccion
      { path: 'author', select: 'username createdAt' },
      // dentro de select van los parametros que queremos obtener de la otra coleccion cuando haga populate y las que no esten seran ignoradas
      { path: 'likes', select: 'username createdAt' }
    ])) as IVideoDocument;

    // const user: IVideoDocument = (await VideoSchema.aggregate([
    //   { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    //   { $lookup: { from: 'User', localField: 'author', foreignField: '_id', as: 'author' } },
    //   { $unwind: 'author' },
    //   { $project: this.aggregateData() }
    // ])) as unknown as IVideoDocument;

    return user;
  }

  // search a video by the autor of the video
  public async getVideoByUsername(username: string): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.findOne({ username }).populate([
      // se debe popular el author y likes ya que estas son conexiones con otra coleccion
      { path: 'author', select: 'username createdAt' },
      // dentro de select van los parametros que queremos obtener de la otra coleccion cuando haga populate y las que no esten seran ignoradas
      { path: 'likes', select: 'username createdAt' }
    ])) as IVideoDocument;

    return user;
  }

  // search a video by its id
  public async getVideoById(idVideo: string): Promise<IVideoDocument> {
    const video: IVideoDocument = (await VideoSchema.findById({ idVideo }).populate([
      // se debe popular el author y likes ya que estas son conexiones con otra coleccion
      { path: 'author', select: 'username' },
      // dentro de select van los parametros que queremos obtener de la otra coleccion cuando haga populate y las que no esten seran ignoradas
      { path: 'likes', select: 'username' }
    ])) as IVideoDocument;

    return video;
  }

  // get all videos in the collections
  public async getAllVideos(): Promise<IVideoDocument> {
    const user: IVideoDocument = (await VideoSchema.find().populate([
      { path: 'author', select: 'username createdAt' },
      { path: 'likes', select: 'username createdAt' }
    ])) as unknown as IVideoDocument;
    return user;
  }

  // private aggregateData() {
  //   return {
  //     _id: 1,
  //     username: 'author.username',
  //     createdAt: 'author.createdAt',
  //     title: 1,
  //     description: 1,
  //     link: 1,
  //     likes: 1,
  //     category: 1
  //   };
  // }
}

export const videoService: VideoService = new VideoService();
