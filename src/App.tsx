import {
  BoldExtension,
  DropCursorExtension,
  LinkExtension,
} from 'remirror/extensions';
import { EditorComponent, Remirror, useRemirror } from '@remirror/react';
import { Quote } from './components/Quote';
import { QuotesExtension } from './extensions/quotes';
import { quotes } from './data';
import type { Quote as QuoteType } from './types';
import 'remirror/styles/all.css';
import './App.css';

const initialContent = `<p>Some love for <a href="https://remirror.io">Remirror</a> from our <a href="https://remirror.io/chat">Discord community</a>.</p>
<p/>
<p>⬅️ Drag and drop the quotes (powered by <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API">HTML's Drag and Drop API</a>) onto this Remirror editor!</p>
`;

export const App = () => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new QuotesExtension(),
      new LinkExtension(),
      new BoldExtension(),
      new DropCursorExtension(),
    ],
    content: initialContent,
    selection: 'start',
    stringHandler: 'html',
  });

  return (
    <Remirror manager={manager} initialContent={state}>
      <header className="app__header">
        <h1>Remirror &amp; native drag-n-drop events</h1>
      </header>
      <div className="app">
        <div className="app__quotes">
          {quotes.map(({ author: { username, color }, ...rest }: QuoteType) => (
            <Quote
              key={rest.id}
              {...rest}
              username={username}
              avatarColor={color}
              draggable
            />
          ))}
        </div>
        <div className="app__editor remirror-theme">
          <EditorComponent />
        </div>
      </div>
    </Remirror>
  );
};
