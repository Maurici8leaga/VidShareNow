import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { videoScheme } from '@video/schemes/video';
import { IVideoDocument } from '@video/interfaces/videoDocument.interface';
import { IUserDocument } from '@user/interfaces/userDocument.interface';
import { userService } from '@root/shared/services/db/user.service';
import { videoService } from '@root/shared/services/db/video.service';
import { commentService } from '@root/shared/services/db/comment.service';
import { ICommentDocument } from '@comment/interfaces/commentDocument.interface';
import { VideoUtility } from './utilities/video.utility';
import HTTP_STATUS from 'http-status-codes';

export class Video extends VideoUtility {
  @joiValidation(videoScheme)
  public async createVideo(req: Request, res: Response): Promise<void> {
    const { title, description, link, category } = req.body;

    const videoId: ObjectId = new ObjectId();

    const user: IUserDocument = await userService.getUserByUsername(`${req.currentUser?.username}`);

    const videoData: IVideoDocument = Video.prototype.videoData({
      _id: videoId,
      author: user,
      title,
      description,
      link,
      category,
      likes: []
    });

    const videoCreated = (await videoService.createVideo(videoData)) as unknown as IVideoDocument;

    res.status(HTTP_STATUS.CREATED).json({ message: 'Video created successfully', video: videoCreated });
  }

  public async readVideos(_req: Request, res: Response): Promise<void> {
    const videoList: IVideoDocument = await videoService.getAllVideos();

    if (!videoList) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'There are not videos yet', videoArray: [] });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Successful request', videoArray: videoList });
  }

  public async searchVideoByUserId(req: Request, res: Response): Promise<void> {
    const video: IVideoDocument = await videoService.getVideoByUserId(`${req.params.id}`);

    const comments: ICommentDocument[] = await commentService.searchCommentByVideoId(`${video._id}`);

    if (!video) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Video not found' });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Successful request', video: video, comments: comments });
  }
}
