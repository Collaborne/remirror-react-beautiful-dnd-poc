import { ComponentType } from 'react';
import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  DOMCompatibleAttributes,
  extension,
  ExtensionPriority,
  ExtensionTag,
  getTextSelection,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  omitExtraAttributes,
  PrimitiveSelection,
  ProsemirrorAttributes,
} from '@remirror/core';
import { NodeViewComponentProps } from '@remirror/react';
import Quote from '../../Quote';

export interface HighlightOptions {
  render?: (
    props: NodeViewComponentProps,
  ) => React.ReactElement<HTMLElement> | null;
}

function isHighlightAttributes(
  thing:
    | ProsemirrorAttributes<any>
    | ProsemirrorAttributes<HighlightAttributes>,
): thing is ProsemirrorAttributes<HighlightAttributes> {
  return (
    (thing as ProsemirrorAttributes<HighlightAttributes>).id !== undefined &&
    (thing as ProsemirrorAttributes<HighlightAttributes>).text !== undefined
  );
}

const DefaultRender: React.FC<NodeViewComponentProps> = ({ node }) => {
  if (isHighlightAttributes(node.attrs) === false) {
    return null;
  }
  const { id, text } = node.attrs;
  return <Quote id={id} text={text} />;
};

/**
 * Adds a file node to the editor
 */
@extension<HighlightOptions>({
  defaultOptions: {
    render: DefaultRender,
  },
})
export class HighlightsExtension extends NodeExtension<HighlightOptions> {
  get name() {
    return 'highlight' as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = props => {
    return this.options.render(props);
  };

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride,
  ): NodeExtensionSpec {
    return {
      attrs: {
        ...extra.defaults(),
        id: { default: null },
        text: { default: '' },
      },
      selectable: true,
      draggable: true,
      atom: true,
      content: '',
      ...override,
      parseDOM: [
        {
          tag: 'div[data-highlight]',
          priority: ExtensionPriority.Low,
          getAttrs: dom => {
            const anchor = dom as HTMLDivElement;
            const id = anchor.getAttribute('data-id');
            const text = anchor.getAttribute('data-text');

            return {
              ...extra.parse(dom),
              id,
              text,
            };
          },
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: node => {
        const { id, text, ...rest } = omitExtraAttributes(node.attrs, extra);
        const attrs: DOMCompatibleAttributes = {
          ...extra.dom(node),
          ...rest,
          'data-id': id,
          'data-text': text,
        };

        return ['div', attrs];
      },
    };
  }

  @command()
  insertHighlight(
    attributes: HighlightAttributes,
    selection?: PrimitiveSelection,
  ): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from, to } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create(attributes);

      dispatch?.(tr.replaceRangeWith(from, to, node));

      return true;
    };
  }
}

interface HighlightAttributes {
  id: string;
  text: string;
}
