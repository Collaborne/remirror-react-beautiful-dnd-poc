import type { Author, Quote } from './types';

const jon: Author = {
  username: 'jon',
  color: '#3BA55C',
};

const geireann: Author = {
  username: 'geireann',
  color: '#FAA61A',
};

const loslobos: Author = {
  username: 'loslobos',
  color: '#5865F2',
};

const laksandy: Author = {
  username: 'laksandy',
  color: '#757E8A',
};

const aulneau: Author = {
  username: 'aulneau',
  color: '#ED4245',
};

const emil: Author = {
  username: 'emil',
  color: '#FAA61A',
};

const mrjack: Author = {
  username: 'mrjack',
  color: '#757E8A',
};

export const quotes: Quote[] = [
  {
    id: '1',
    text: "Remirror looks amazing. As someone who struggled, and keeps struggling, to get up and running with ProseMirror, I can't believe I didn't find this project sooner.",
    author: jon,
    url: 'https://discord.com/channels/726035064831344711/745695521305526302/881720147369402378',
    date: 1630321200000,
  },
  {
    id: '2',
    text: "I'm using @remirror for a project of mine and have absolutely loved it so far - thank you for the great tool!",
    author: geireann,
    url: 'https://discord.com/channels/726035064831344711/745695521305526302/901871071131758694',
    date: 1635073200000,
  },
  {
    id: '3',
    text: "This is a pretty awesome library, can't wait to learn enough to contribute! 👍",
    author: loslobos,
    url: 'https://discord.com/channels/726035064831344711/745695521305526302/901948527108825118',
    date: 1635073200000,
  },
  {
    id: '4',
    text: 'Remirror is awesome so far 👏🏻 . I am a sponsor to the project now 👍 .',
    author: laksandy,
    url: 'https://discord.com/channels/726035064831344711/745695521305526302/852371706106347553',
    date: 1623322800000,
  },
  {
    id: '5',
    text: 'Really loving the library, and very excited to be using it.',
    author: aulneau,
    url: 'https://discord.com/channels/726035064831344711/745695521305526302/813798175923896390',
    date: 1614081600000,
  },
  {
    id: '6',
    text: "Great work on this project! It's been very nice to work with.",
    author: emil,
    url: 'https://discord.com/channels/726035064831344711/726035065338986528/738270486773104660',
    date: 1596106800000,
  },
  {
    id: '7',
    text: 'Been building a project with remirror for over a year now. Thanks for all the hard work. Here to contribute where I can 🙂',
    author: mrjack,
    url: 'https://discord.com/channels/726035064831344711/726035065338986528/863597403880816701',
    date: 1626001200000,
  },
];
