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
    bio?: string;
    fullname: string;
    username?: string;
    profile_pic?: string;
    _count: {
      follower: number;
      blogs: number;
    };
  };
  createdAt: Date;
  categories: Tags[];
}

export interface UserDetailsInput {
  image: {
    url: string;
    file: File | null;
  };
  fullname: string;
  username: string;
  intro: string;
}
