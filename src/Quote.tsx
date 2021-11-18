import { forwardRef } from 'react';
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';
import clsx from 'clsx';
import type { Quote as QuoteType } from './types';

interface QuoteProps extends QuoteType {
  isDragging?: boolean;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

const Quote = forwardRef<HTMLDivElement, QuoteProps>(
  (
    { id, text, isDragging = false, draggableProps = {}, dragHandleProps = {} },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        className={clsx('quote', { 'is-dragging': isDragging })}
        data-id={id}
        data-text={text}
      >
        {text}
      </div>
    );
  },
);

export default Quote;
