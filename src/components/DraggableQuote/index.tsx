import { Draggable } from 'react-beautiful-dnd';
import { Quote } from '../Quote';
import type { Quote as QuoteType } from '../../types';

export interface DraggableQuoteProps {
  quote: QuoteType;
  index: number;
}

export const DraggableQuote = ({
  quote,
  index,
}: DraggableQuoteProps): JSX.Element => {
  const { author, ...rest } = quote;
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided, snapshot) => (
        <Quote
          ref={provided.innerRef}
          {...rest}
          username={author.username}
          avatarColor={author.color}
          draggableProps={provided.draggableProps}
          dragHandleProps={provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        />
      )}
    </Draggable>
  );
};
