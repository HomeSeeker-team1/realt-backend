// @ts-ignore
import { getSubtitles } from 'youtube-captions-scraper';

const getYoutubeSubtitles = async (videoId: string | null) => {
  try {
    const subs = await getSubtitles({
      videoID: videoId,
      lang: 'en',
    });
    return subs;
  } catch (error) {
    return null;
  }
};

export default getYoutubeSubtitles;
