import puppeteer from 'puppeteer';
import getYouTubeID from 'get-youtube-id';
import randomWord from 'random-words';

import CRAWLER_CONSTANTS from '../../../constants/crawler/crawler';
import getYoutubeSubtitles from '../../services/getYoutubeSubtitles';
import databaseSqlQuery from '../../database-utils';

const mouseMoveToSearchFieldAndMakeRequest = async (
  page: any,
  word: string,
) => {
  const searchField = await page.$('#search-input');
  const searchButton = await page.$('#search-icon-legacy');
  await searchField.click();
  await page.keyboard.type(word);
  await searchButton.click();
};

const spinTheWheel = async (page: any) => {
  await page.mouse.wheel({ deltaY: 5000 });
  await page.waitFor(1000);
};

const spinTheWheelAndGetVideoLinks = async (page: any) => {
  await spinTheWheel(page);
  return page.evaluate(() => {
    const videos = document.querySelectorAll('#video-title');
    const videosArray = Array.from(videos);

    return videosArray.map((elem: any) => {
      const title = elem.title.replace(/[^a-zA-ZА-Яа-яЁё\s0-9\\-]/gi, '');

      return {
        url: elem.href,
        title,
      };
    });
  });
};

const getOver200Links = async (page: any, startTime: number): Promise<any> => {
  const links = await spinTheWheelAndGetVideoLinks(page);
  console.log(links);
  const timeNow = Date.now();
  if (
    links.length < CRAWLER_CONSTANTS.LINK_COUNTER
    && timeNow < startTime + CRAWLER_CONSTANTS.TIMEOUT
  ) {
    return getOver200Links(page, startTime);
  }

  return links;
};

const scrapeYoutubeVideoLinks = async (url: string) => {
  const startTime = Date.now();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.goto(url);
  await mouseMoveToSearchFieldAndMakeRequest(page, randomWord());
  const links = await getOver200Links(page, startTime);

  browser.close();

  return links;
};

const crawler = {
  async run() {
    try {
      let counter = 0;
      const videosData = await scrapeYoutubeVideoLinks(CRAWLER_CONSTANTS.URL);
      for (const data of videosData) {
        const videoURL = data.url;
        const { title } = data;
        const videoID: string | null = getYouTubeID(videoURL);
        const subtitles = await getYoutubeSubtitles(videoID);
        if (subtitles) {
          const filteredSubtitles = subtitles.map((subtitleData: any) => {
            const filteredData = {
              ...subtitleData,
              text: subtitleData.text.replace(
                /[^a-zA-ZА-Яа-яЁё\s0-9\\-\\,\\.]/gi,
                '',
              ),
            };

            return filteredData;
          });
          const subtitlesJSON = JSON.stringify(filteredSubtitles);
          const subtitlesAll = filteredSubtitles.reduce(
            (acum: any, text: any) => `${acum + text.text} `,
            '',
          );
          const subtitlesAllJSON = JSON.stringify(subtitlesAll);
          const query = `INSERT INTO youtube_subtitles (url, title, subtitles, subtitles_all) VALUES
          ('${videoURL}', '${title}', '${subtitlesJSON}', '${subtitlesAllJSON}');`;
          const res = await databaseSqlQuery(query);
          if (res.rowCount === 1) {
            counter += 1;
          }
        }
      }
      console.log('crawl end, subtitles added: ', counter);
      return counter;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

export default crawler;
