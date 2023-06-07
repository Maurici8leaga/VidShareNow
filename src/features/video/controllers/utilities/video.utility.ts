import { IVideoDocument } from '@video/interfaces/videoDocument.interface';
import { IVideoData } from '@video/interfaces/videoData.interface';
import { Generators } from '@helpers/generators/generators';

export abstract class VideoUtility {
  protected videoData(data: IVideoData): IVideoDocument {
    const { _id, author, title, description, link, likes, category } = data;

    return {
      _id,
      author,
      title: Generators.firstLetterCapitalized(title),
      description: Generators.firstLetterCapitalized(description),
      link,
      likes,
      category: Generators.firstLetterCapitalized(category),
      createdAt: new Date()
    } as unknown as IVideoDocument;
  }
}
