export interface News {
  _id: string;
  abstract: string;
  web_url: string;
  multimedia: { url: string }[];
  pub_date: string;
  source: string;
}
