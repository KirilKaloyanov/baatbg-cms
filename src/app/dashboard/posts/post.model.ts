interface _Post {
  id: string;
  linkVideo: string;
  menuPath: string;
  position: number;
  subMenuPath: string;
}
export interface Post extends _Post {
  heading: {
    en: string,
    bg: string
  };
  text: {
    bg: string;
    en: string;
  }
}

export interface UIPost extends _Post {
  headingBg: string;
  headingEn: string;
  textBg: string;
  textEn: string;
}