
export interface Post {
  id: string;
  linkVideo: string;
  menuPath: string;
  subMenuPath: string;
  heading: {
    en: string,
    bg: string
  };
  text: {
    bg: string;
    en: string;
  }
}

export interface UIPost {
  id: string;
  linkVideo: string;
  menuPath: string;
  subMenuPath: string;
  headingBg: string;
  headingEn: string;
  textBg: string;
  textEn: string;
}