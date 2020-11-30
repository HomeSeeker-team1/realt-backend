import {
  Router, Request, Response, request,
} from 'express';
import crawler from './controller';
import databaseSqlQuery from '../../database-utils';

const router = Router();

router.get('/crawler/run', async (req: Request, res: Response) => {
  try {
    const addedSubtitlesCounter = await crawler.run();

    return res
      .status(200)
      .json({
        message: `Succesfull! Added ${addedSubtitlesCounter} subtitles`,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/crawler/get-urls', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const query = `SELECT * FROM youtube_subtitles WHERE subtitles_all LIKE '%${text} %'`;
    const response = await databaseSqlQuery(query);
    const foundSubtitles = response.rows.map((subtitleData: any) => {
      const { url, title } = subtitleData;
      const sentences = subtitleData.subtitles.filter((subtitle: any) => {
        if (subtitle.text.includes(text)) {
          return true;
        }
        return false;
      });
      return {
        url,
        title,
        sentences,
      };
    });
    if (foundSubtitles.length === 0) {
      return res.status(200).json({
        message: 'Subtitles not found',
      });
    }
    return res.status(200).json(foundSubtitles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
