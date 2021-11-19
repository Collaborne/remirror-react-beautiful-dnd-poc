import { forwardRef, useCallback } from 'react';
import { useEditorView, useRemirrorContext } from '@remirror/react';
import type { MouseEventHandler } from 'react';
import type { Id } from '../../types';
import 'remirror/styles/all.css';

const mouseToDragMap = new Map([
  ['mouseover', 'dragover'],
  ['mouseleave', 'dragleave'],
  ['mouseup', 'dragend'],
]);

export interface EditorProps {
  isDragging: boolean;
  draggableId?: Id;
}

export const Editor = forwardRef<HTMLElement, EditorProps>(
  ({ isDragging, draggableId, ...rest }, ref) => {
    const { getRootProps } = useRemirrorContext();
    const view = useEditorView();

    // For ProseMirror drop cursors to work we need to re-emit React Beautiful DND
    // events as drag events
    const mouseToDragEvent: MouseEventHandler<HTMLDivElement> = useCallback(
      ({ type, view: eventView, ...rest }) => {
        if (!isDragging) {
          return;
        }
        const newType = mouseToDragMap.get(type);
        if (!newType) {
          return;
        }

        const dragEvent = new DragEvent(newType, rest);
        view.dom.dispatchEvent(dragEvent);
      },
      [view, isDragging],
    );

    return (
      <div className="remirror-theme">
        <div
          {...rest}
          {...getRootProps({ ref })}
          onMouseOver={mouseToDragEvent}
          onMouseLeave={mouseToDragEvent}
          onMouseUp={mouseToDragEvent}
        />
      </div>
    );
  },
);
