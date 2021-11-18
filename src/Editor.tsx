import { forwardRef, useCallback } from 'react';
import {
  useCommands,
  useEditorView,
  useRemirrorContext,
} from '@remirror/react';
import type { MouseEventHandler } from 'react';
import type { DroppableProvidedProps } from 'react-beautiful-dnd';
import { useQuotesContext } from './QuotesContext';
import type { Id } from './types';

interface EditorProps extends DroppableProvidedProps {
  isDragging: boolean;
  draggableId?: Id;
}

type GenericFunction = (...args: any[]) => void;
function over<T extends GenericFunction>(fns: T[]): GenericFunction {
  return (...args) => {
    fns.forEach(fn => {
      fn(...args);
    });
  };
}

const Editor = forwardRef<HTMLElement, EditorProps>(
  ({ isDragging, draggableId, ...rest }, ref) => {
    const { getRootProps } = useRemirrorContext();
    const { insertHighlight } = useCommands();
    const view = useEditorView();

    const { quotesById } = useQuotesContext();
    const quote = draggableId ? quotesById[draggableId] : null;

    // For drop cursor to work
    const mouseToDragEvent: (
      type: string,
    ) => MouseEventHandler<HTMLDivElement> = useCallback(
      (type: string) => {
        return e => {
          if (!isDragging) {
            return;
          }
          const { screenX, screenY, clientX, clientY } = e;
          const dragEvent = new DragEvent(type, {
            screenX,
            screenY,
            clientX,
            clientY,
          });
          view.dom.dispatchEvent(dragEvent);
        };
      },
      [view, isDragging, quote],
    );

    const handleDrop: MouseEventHandler<HTMLDivElement> = useCallback(
      e => {
        if (!isDragging || !quote) {
          return;
        }
        const { clientX, clientY } = e;

        // Figure out where we should action the drop
        const pos =
          view.posAtCoords({ left: clientX, top: clientY })?.pos ??
          view.state.selection.anchor;

        insertHighlight(quote, pos);
      },
      [isDragging, view, quote, insertHighlight],
    );

    return (
      <div
        {...rest}
        {...getRootProps({ ref })}
        onMouseOver={mouseToDragEvent('dragover')}
        onMouseLeave={mouseToDragEvent('dragleave')}
        onMouseUp={over<MouseEventHandler<HTMLDivElement>>([
          mouseToDragEvent('dragend'),
          handleDrop,
        ])}
      />
    );
  },
);

export default Editor;
