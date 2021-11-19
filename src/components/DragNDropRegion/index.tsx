import { MouseEventHandler, useCallback, useRef } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import clsx from 'clsx';
import { useCommands, useEditorView } from '@remirror/react';
import { useQuotesContext } from '../QuotesContext';
import type { ReactNode } from 'react';

export interface DragNDropRegionProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

interface MouseCoords {
  clientX: number;
  clientY: number;
}

export const DragNDropRegion = ({
  children,
  className,
}: DragNDropRegionProps): JSX.Element => {
  const { insertQuote } = useCommands();
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
    (result: DropResult) => {
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
      const {
        author: { username, color },
        ...rest
      } = quote;
      insertQuote({ ...rest, username, avatarColor: color }, pos);
    },
    [view, insertQuote, quotesById],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div onMouseUp={handleMouseUp} className={clsx(className)}>
        {children}
      </div>
    </DragDropContext>
  );
};
