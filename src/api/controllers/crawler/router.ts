import { Router, Request, Response } from 'express';

import crawler from './controller';
import databaseSqlQuery from '../../database-utils';
import {
  ISubtitle,
  ISubtitleData,
  ISubtitleEndPoint,
} from '../../../interfaces/subtitle/subtitle';

const router = Router();

const searchMatches = (text: string, key: string) => {
  const regExp = new RegExp(`\\b${key}\\b`);
  return text.match(regExp);
};

router.get('/crawler/run', async (req: Request, res: Response) => {
  try {
    const addedSubtitlesCounter = await crawler.run();

    return res.status(200).json({
      message: `Succesfull! Added ${addedSubtitlesCounter} subtitles`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/subtitle/get-urls/', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const query = `SELECT * FROM youtube_subtitles WHERE subtitles_all LIKE '%${text} %'`;
    const response = await databaseSqlQuery(query);
    const foundSubtitles = response.rows.map((subtitleData: ISubtitle) => {
      const { url, title } = subtitleData;

      const sentences: ISubtitleEndPoint[] = [];
      subtitleData.subtitles.forEach((subtitle: ISubtitleData) => {
        const isMatch = searchMatches(subtitle.text, text);
        console.log(isMatch);
        if (isMatch) {
          sentences.push({
            time: subtitle.start,
            duration: subtitle.dur,
            sentenceText: subtitle.text,
          });
        }
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
