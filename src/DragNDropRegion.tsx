import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import type { ReactNode } from 'react';
import { useCommands } from '@remirror/react';
import { useQuotesContext } from './QuotesContext';
import { useCallback } from 'react';

interface DragNDropRegionProps {
  children: ReactNode | ReactNode[];
}

const DragNDropRegion = ({ children }: DragNDropRegionProps): JSX.Element => {
  const { insertText } = useCommands();
  const { quotesById } = useQuotesContext();

  const onDragEnd = useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      // const { draggableId, destination } = result;
      // if (destination?.droppableId === 'editor') {
      //   const quote = quotesById[draggableId];
      //   insertText(quote.content);
      // }
    },
    [insertText, quotesById],
  );

  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
};

export default DragNDropRegion;
