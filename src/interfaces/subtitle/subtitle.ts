export interface ISubtitleData {
  dur: string;
  text: string;
  start: string;
}

export interface ISubtitle {
  url: string;
  title: string;
  subtitles: ISubtitleData[];
  subtitles_all: string;
}

export interface ISubtitleEndPoint {
  time: string;
  duration: string;
  sentenceText: string;
}
