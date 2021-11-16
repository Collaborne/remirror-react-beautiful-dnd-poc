export type Id = string;

export interface Author {
  id: Id;
  name: string;
}

export interface Quote {
  id: Id;
  content: string;
  author: Author;
}

export type QuoteMap = Record<Id, Quote>;
