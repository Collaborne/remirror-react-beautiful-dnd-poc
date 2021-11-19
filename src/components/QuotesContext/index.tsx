import { createContext, useMemo, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Quote, QuoteMap } from '../../types';

export interface QuotesContextInterface {
  quotes: Quote[];
  quotesById: QuoteMap;
}

export interface QuotesContextProps {
  quotes: Quote[];
  children: ReactNode | ReactNode[];
}

const Index = createContext<QuotesContextInterface | null>(null);

export function QuotesProvider({
  quotes,
  children,
}: QuotesContextProps): JSX.Element {
  const quotesById: QuoteMap = useMemo(() => {
    return quotes.reduce((acc, quote) => {
      acc[quote.id] = quote;
      return acc;
    }, {} as QuoteMap);
  }, [quotes]);

  return (
    <Index.Provider value={{ quotes, quotesById }}>{children}</Index.Provider>
  );
}

export function useQuotesContext(): QuotesContextInterface {
  const context = useContext(Index);
  if (context === null) {
    throw new Error('useQuotesContext must be used within a QuotesProvider');
  }
  return context;
}
