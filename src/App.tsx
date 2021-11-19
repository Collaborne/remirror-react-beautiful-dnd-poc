import {
  BoldExtension,
  DropCursorExtension,
  LinkExtension,
} from 'remirror/extensions';
import { Remirror, useRemirror } from '@remirror/react';
import { Droppable } from 'react-beautiful-dnd';
import { DragNDropRegion } from './components/DragNDropRegion';
import { Editor } from './components/Editor';
import { DraggableQuote } from './components/DraggableQuote';
import { QuotesProvider } from './components/QuotesContext';
import { QuotesExtension } from './extensions/quotes';
import { quotes } from './data';
import type { Quote as QuoteType } from './types';
import './App.css';

const initialContent = `<p>Some love for <a href="https://remirror.io">Remirror</a> from our <a href="https://remirror.io/chat">Discord community</a>.</p>
<p/>
<p>⬅️ Drag and drop the quotes (powered by <a href="https://github.com/atlassian/react-beautiful-dnd">react-beautiful-dnd</a>) onto this Remirror editor!</p>
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
      <QuotesProvider quotes={quotes}>
        <header className="app__header">
          <h1>Remirror &amp; react-beautiful-dnd PoC</h1>
        </header>
        <DragNDropRegion className="app">
          <Droppable droppableId="list" isDropDisabled>
            {provided => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="app__quotes"
              >
                {quotes.map((quote: QuoteType, index: number) => (
                  <DraggableQuote quote={quote} index={index} key={quote.id} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="app__editor">
            <Droppable droppableId="editor">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Editor
                    isDragging={snapshot.isDraggingOver}
                    draggableId={snapshot.draggingOverWith}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragNDropRegion>
      </QuotesProvider>
    </Remirror>
  );
};
