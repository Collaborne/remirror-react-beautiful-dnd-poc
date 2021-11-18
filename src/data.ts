import type { Author, Quote } from './types';

const luke: Author = {
  id: '1',
  name: 'Luke',
};

const rey: Author = {
  id: '2',
  name: 'Rey',
};

const finn: Author = {
  id: '3',
  name: 'Finn',
};

const kylo: Author = {
  id: '4',
  name: 'Kylo',
};

export const authors: Author[] = [luke, rey, finn, kylo];

export const quotes: Quote[] = [
  {
    id: '1',
    text: 'Sometimes life is scary and dark',
    author: rey,
  },
  {
    id: '2',
    text: 'Sucking at something is the first step towards being sorta good at something.',
    author: luke,
  },
  {
    id: '3',
    text: "You got to focus on what's real, man",
    author: luke,
  },
  {
    id: '4',
    text: 'Is that where creativity comes from? From sad biz?',
    author: finn,
  },
  {
    id: '5',
    text: 'Homies help homies. Always',
    author: finn,
  },
  {
    id: '6',
    text: 'Responsibility demands sacrifice',
    author: kylo,
  },
  {
    id: '7',
    text: "That's it! The answer was so simple, I was too smart to see it!",
    author: kylo,
  },
  {
    id: '8',
    text: "People make mistakes. It's all a part of growing up and you never really stop growing",
    author: finn,
  },
  {
    id: '9',
    text: "Don't you always call sweatpants 'give up on life pants', Jake?",
    author: finn,
  },
  {
    id: '10',
    text: 'I should not have drunk that much tea!',
    author: kylo,
  },
  {
    id: '11',
    text: 'Please! I need the real you!',
    author: kylo,
  },
  {
    id: '12',
    text: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    author: kylo,
  },
];
