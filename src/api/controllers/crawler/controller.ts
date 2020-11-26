import puppeteer from 'puppeteer';

import CRAWLER_URLS from '../../../constants/crawler/crawler';

const spinTheWheel = async (page: any) => {
  await page.mouse.wheel({ deltaY: 10000 });
  await page.waitFor(1000);
};

const spinTheWheelAndGetVideoLinks = async (page: any) => {
  await spinTheWheel(page);
  return page.evaluate(() => {
    const videos = document.querySelectorAll('#video-title-link');
    const videosArray = Array.from(videos);
    return videosArray.map((elem: any) => elem.href);
  });
};

const getOver100Links = async (page: any): Promise<any> => {
  const links = await spinTheWheelAndGetVideoLinks(page);

  if (links.length < 100) {
    return getOver100Links(page);
  }

  return links;
};

const scrapeYoutubeVideoLinks = async (url: string) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  const links = await getOver100Links(page);

  browser.close();

  return links;
};

const crawler = {
  async run() {
    try {
      const links = await scrapeYoutubeVideoLinks(CRAWLER_URLS.YOUTUBE);

      return links;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

export default crawler;
