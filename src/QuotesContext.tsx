import { createContext, useState, useMemo, useContext } from 'react';
import type { ReactNode } from 'react';
import { quotes as initial } from './data';
import type { Quote, QuoteMap } from './types';

export interface QuotesContextInterface {
  quotes: Quote[];
  quotesById: QuoteMap;
}

export interface QuotesContextProps {
  children: ReactNode | ReactNode[];
}

const QuotesContext = createContext<QuotesContextInterface | null>(null);

export function QuotesProvider({ children }: QuotesContextProps): JSX.Element {
  const [quotes, setQuotes] = useState<Quote[]>(initial);

  const quotesById: QuoteMap = useMemo(() => {
    return quotes.reduce((acc, quote) => {
      acc[quote.id] = quote;
      return acc;
    }, {} as QuoteMap);
  }, [quotes]);

  return (
    <QuotesContext.Provider value={{ quotes, quotesById }}>
      {children}
    </QuotesContext.Provider>
  );
}

export function useQuotesContext(): QuotesContextInterface {
  const context = useContext(QuotesContext);
  if (context === null) {
    throw new Error('useQuotesContext must be used within a QuotesProvider');
  }
  return context;
}
