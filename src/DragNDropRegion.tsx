import { MouseEventHandler, useCallback, useRef } from 'react';
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import type { ReactNode } from 'react';
import { useCommands, useEditorView } from '@remirror/react';
import { useQuotesContext } from './QuotesContext';

interface DragNDropRegionProps {
  children: ReactNode | ReactNode[];
}

interface MouseCoords {
  clientX: number;
  clientY: number;
}

const DragNDropRegion = ({ children }: DragNDropRegionProps): JSX.Element => {
  const { insertHighlight } = useCommands();
  const { quotesById } = useQuotesContext();
  const view = useEditorView();

  const mouseCoords = useRef<MouseCoords>();

  // onDragEnd does not give us access to the raw event, store the drag end position
  // in a ref so we can use it to obtain ProseMirror document position.
  const handleMouseUp: MouseEventHandler<HTMLDivElement> = useCallback(
    ({ clientX, clientY }) => {
      mouseCoords.current = { clientX, clientY };
    },
    [],
  );

  const onDragEnd = useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      const { draggableId, destination } = result;
      if (destination?.droppableId !== 'editor') {
        return;
      }
      if (!mouseCoords.current) {
        console.warn('No usable mouse coordinates set');
        return;
      }

      const { clientX, clientY } = mouseCoords.current;
      const pos =
        view.posAtCoords({ left: clientX, top: clientY })?.pos ??
        view.state.selection.anchor;

      const quote = quotesById[draggableId];
      insertHighlight(quote, pos);
    },
    [view, insertHighlight, quotesById],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div onMouseUp={handleMouseUp}>{children}</div>
    </DragDropContext>
  );
};

export default DragNDropRegion;
