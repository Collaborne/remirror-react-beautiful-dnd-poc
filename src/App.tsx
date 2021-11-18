import { BoldExtension, DropCursorExtension } from 'remirror/extensions';
import { Remirror, useRemirror } from '@remirror/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { HighlightsExtension } from './extensions/highlights';
import DragNDropRegion from './DragNDropRegion';
import Editor from './Editor';
import Quote from './Quote';
import { QuotesProvider, useQuotesContext } from './QuotesContext';
import type { Quote as QuoteType } from './types';
import 'remirror/styles/all.css';
import './App.css';

interface DraggableQuoteProps {
  quote: QuoteType;
  index: number;
}

function DraggableQuote({ quote, index }: DraggableQuoteProps): JSX.Element {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided, snapshot) => (
        <Quote
          ref={provided.innerRef}
          {...quote}
          draggableProps={provided.draggableProps}
          dragHandleProps={provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        />
      )}
    </Draggable>
  );
}

function QuoteList(): JSX.Element {
  const { quotes } = useQuotesContext();
  return (
    <div className="quotes-list">
      {quotes.map((quote: QuoteType, index: number) => (
        <DraggableQuote quote={quote} index={index} key={quote.id} />
      ))}
    </div>
  );
}

const App = () => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new DropCursorExtension(),
      new HighlightsExtension(),
    ],
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
              <Droppable droppableId="list" isDropDisabled>
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
            </div>
          </DragNDropRegion>
        </QuotesProvider>
      </Remirror>
    </div>
  );
};

export default App;
