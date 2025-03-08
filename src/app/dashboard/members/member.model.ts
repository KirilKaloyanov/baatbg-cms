export interface Member {
  id: string;
  typeId: string;
  name: {
    bg: string;
    en: string;
  };
  description: {
    bg: string;
    en: string;
  };
  address?: {
    bg: string;
    en: string;
  };
  website?: string;
  phone?: string;
  email?: string;
  img?: string;
}

export interface MemberType {
  id: string;
  label: {
    en: string;
    bg: string;
  };
}
