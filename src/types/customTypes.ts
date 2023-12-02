export interface Tags {
  id: string;
  name: string;
  color: string;
}

export interface BlogPreview {
  title: string;
  description: string;
  length: number;
  thumbnail: string;
  slug?: string;
  author: {
    fullname: string;
    username?: string;
    profile_pic?: string;
  };
  createdAt: Date;
  categories: Tags[];
}
