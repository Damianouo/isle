export type Post = {
  id: string;
  url: string;
  sourceUrl: string;
  type: 'post' | 'reply';
  imgSrc: string;
  author: string;
  published_at: string;
  text: string;
  tags: string[];
  like: number;
  reply: number;
  repost: number;
  share: number;
};
