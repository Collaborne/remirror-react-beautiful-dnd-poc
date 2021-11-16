import { BoldExtension, DropCursorExtension } from 'remirror/extensions';
import { Remirror, useRemirror } from '@remirror/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import DragNDropRegion from './DragNDropRegion';
import Editor from './Editor';
import { QuotesProvider, useQuotesContext } from './QuotesContext';
import type { Quote as QuoteType } from './types';
import 'remirror/styles/all.css';
import './App.css';

interface QuoteProps {
  quote: QuoteType;
  index: number;
}

function Quote({ quote, index }: QuoteProps): JSX.Element {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={clsx('quote', { 'is-dragging': snapshot.isDragging })}
        >
          {quote.content}
        </div>
      )}
    </Draggable>
  );
}

function QuoteList(): JSX.Element {
  const { quotes } = useQuotesContext();
  return (
    <>
      {quotes.map((quote: QuoteType, index: number) => (
        <Quote quote={quote} index={index} key={quote.id} />
      ))}
    </>
  );
}

const App = () => {
  const { manager, state } = useRemirror({
    extensions: () => [new BoldExtension(), new DropCursorExtension()],
    content: '<p>I love <b>Remirror</b></p>',
    selection: 'start',
    stringHandler: 'html',
  });

  return (
    <div className="remirror-theme">
      {/* the className is used to define css variables necessary for the editor */}
      <Remirror manager={manager} initialContent={state}>
        <QuotesProvider>
          <DragNDropRegion>
            <div className="dnd-region">
              <Droppable droppableId="list">
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <QuoteList />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="editor">
                <Droppable droppableId="editor">
                  {(provided, snapshot) => (
                    <Editor
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDragging={snapshot.isDraggingOver}
                      draggableId={snapshot.draggingOverWith}
                    />
                  )}
                </Droppable>
              </div>
            </div>
          </DragNDropRegion>
        </QuotesProvider>
      </Remirror>
    </div>
  );
};

export default App;
