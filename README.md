# Remirror Drag and Drop PoC (with react-beautiful-dnd)

## Motivation

Many modern UIs have drag and drop interfaces, including NEXT - our platform that helps great teams create better products, services, and experiences.

We found during user testing, that users expected to be able to drag-n-drop UI elements onto the text editor. However whilst [Remirror](https://remirror.io) **does** support native drag-n-drop events, it doesn't support react-beautiful-dnds Draggables.

## Our approach

### [Live demo](https://collaborne.github.io/remirror-react-beautiful-dnd-poc)

Or locally

1. `npm install`
2. `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Technologies used

#### Create React App

Does what is says on the tin.

#### Remirror

[Remirror](https://github.com/remirror/remirror) is a wrapper library for ProseMirror, it creates an abstraction layer that makes ProseMirror much easier to work with, as well as providing React and ProseMirror integration.

Remirror provides extensions, that abstract over various ProseMirror concepts such as schemas, commands and plugins, making it much simpler to group related logic together. Using these extensions it is much easier to construct an out-of-the-box editor, whilst still maintaining the flexibility that ProseMirror is known for.

#### react-beautiful-dnd

[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) exists to create beautiful drag and drop for lists that anyone can use - even people who cannot see.

react-beautiful-dnd is a higher level abstraction specifically built for lists (vertical, horizontal, movement between lists, nested lists and so on.

## Outcomes

### Use native drag and drop, if you can

Our react-beautiful-dnd based solution requires lots of workarounds, that could be confusing to maintain. 

If your use case for drag-n-drop behaviour is simple, it may be more worthwhile to remove react-beautiful-dnd's abstraction layer, and use the _native_ implementation instead. 

For reference, a native implementation is available on the [`native-dnd` branch of this repo](https://github.com/Collaborne/remirror-react-beautiful-dnd-poc/tree/native-dnd).

### Drag and Drop events are not triggered when dragging react-beautiful-dnd elements

This proved to be the fundamental problem - even when offsetting the dragged UI element, so the mouse cursor was directly over the editor, the drag event handlers were not triggered within the editor.

This was overcome by re-emitting _mouse_ events as _drag_ events on the ProseMirror doc view. This proved to be easily to implement, as `DragEvent` is an extension of `MouseEvent` in JavaScript.

We also utilised react-beautiful-dnds `snapshot.isDragging` to differentiate actual drags from normal mouse movements.

<!-- prettier-ignore-start -->
```tsx
// src/components/Editor/index.tsx
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
```
<!-- prettier-ignore-end -->

### DataTransfer and untrusted drop events

The above approach unearthed a further issue, due to browser security restrictions you **cannot** synthetically create drag-n-drop events **with data**.

This means we cannot pass information to the editor directly from the drop event itself.

#### Remirror's useCommands to the rescue

Instead we can use react-beautiful-dnd's `onDragEnd` handle, with commands exposed via Remirror's `useCommands` hook to insert content into the editor manually.

The difficulty here is to figure out _where_ to insert the content - we need to translate where the user dropped the UI element, to a document position in the editor.

react-beautiful-dnd's `onDragEnd` does not expose the raw DragEvent, making it difficult to obtain the `clientX` and `clientY` event values, that we could normally use to figure out where to insert. If we instead use a `onMouseUp` event listener, we can store `clientX` and `clientY` from here, and use them in our `onDragEnd` handler.

<!-- prettier-ignore-start -->
```tsx
// src/components/DragNDropRegion/index.tsx
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
        const { author: { username, color }, ...rest } = quote;
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
```
<!-- prettier-ignore-end -->
