export type Id = string;

export interface Author {
  username: string;
  color: string;
}

export interface Quote {
  id: Id;
  text: string;
  author: Author;
  url: string;
  date: number;
}

export type QuoteMap = Record<Id, Quote>;
