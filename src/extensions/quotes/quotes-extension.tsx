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
import { Quote } from '../../components/Quote';

export interface QuoteOptions {
  render?: (
    props: NodeViewComponentProps,
  ) => React.ReactElement<HTMLElement> | null;
}

function isQuoteAttributes(
  thing: ProsemirrorAttributes<any> | ProsemirrorAttributes<QuoteAttributes>,
): thing is ProsemirrorAttributes<QuoteAttributes> {
  return (
    (thing as ProsemirrorAttributes<QuoteAttributes>).id !== undefined &&
    (thing as ProsemirrorAttributes<QuoteAttributes>).text !== undefined
  );
}

const DefaultRender: React.FC<NodeViewComponentProps> = ({ node }) => {
  if (isQuoteAttributes(node.attrs) === false) {
    return null;
  }
  const { id, text, url, date, username, avatarColor } = node.attrs;
  return (
    <Quote
      id={id}
      text={text}
      url={url}
      date={date}
      username={username}
      avatarColor={avatarColor}
    />
  );
};

/**
 * Adds a file node to the editor
 */
@extension<QuoteOptions>({
  defaultOptions: {
    render: DefaultRender,
  },
})
export class QuotesExtension extends NodeExtension<QuoteOptions> {
  get name() {
    return 'quote' as const;
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
        text: { default: null },
        url: { default: null },
        date: { default: null },
        username: { default: null },
        avatarColor: { default: null },
      },
      selectable: true,
      draggable: true,
      atom: true,
      content: '',
      ...override,
      parseDOM: [
        {
          tag: 'div[data-quote]',
          priority: ExtensionPriority.Low,
          getAttrs: dom => {
            const anchor = dom as HTMLDivElement;
            const id = anchor.getAttribute('data-id');
            const text = anchor.getAttribute('data-text');
            const url = anchor.getAttribute('data-url');
            const date = anchor.getAttribute('data-date');
            const username = anchor.getAttribute('data-username');
            const avatarColor = anchor.getAttribute('data-avatar-color');

            return {
              ...extra.parse(dom),
              id,
              text,
              url,
              date: date ? parseFloat(date) : 0,
              username,
              avatarColor,
            };
          },
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: node => {
        const { id, text, url, date, username, avatarColor, ...rest } =
          omitExtraAttributes(node.attrs, extra);
        const attrs: DOMCompatibleAttributes = {
          ...extra.dom(node),
          ...rest,
          'data-quote': '',
          'data-id': id,
          'data-text': text,
          'data-url': url,
          'data-date': date,
          'data-username': username,
          'data-avatar-color': avatarColor,
        };

        return ['div', attrs];
      },
    };
  }

  @command()
  insertQuote(
    attributes: QuoteAttributes,
    selection?: PrimitiveSelection,
  ): CommandFunction {
    return ({ tr, dispatch }) => {
      const { from } = getTextSelection(selection ?? tr.selection, tr.doc);
      const node = this.type.create(attributes);

      dispatch?.(tr.insert(from, node));

      return true;
    };
  }
}

interface QuoteAttributes {
  id: string;
  text: string;
  url: string;
  date: number;
  username: string;
  avatarColor: string;
}
