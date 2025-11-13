'use client';

import { useEffect, useState } from 'react';

import LoadingSpinner from './components/LoadingSpinner';
import StockCard from './components/StockCard';
import { SymbolMap } from './constants/constants';
import { StockCardType } from './types/stocks';
import { getStockLogoURL } from './utils/utils';

export default function Home() {
  const [stocks, setStocks] = useState<StockCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      const stockSymbols = Object.keys(SymbolMap);
      const stockPromises = stockSymbols.map(async (symbol): Promise<StockCardType | null> => {
        try {
          const response = await fetch(`/api/stockdata/quote?symbol=${symbol}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${symbol}`);
          }
          const data = await response.json();

          if (data['Global Quote']) {
            const quote = data['Global Quote'];
            const name = quote['01. symbol'] || symbol;
            const price = parseFloat(quote['05. price'] || '0');
            const change = parseFloat(quote['09. change'] || '0');
            const changePercent = parseFloat(quote['10. change percent']?.replace('%', '') || '0');

            return {
              symbol,
              name,
              price,
              change,
              changePercent,
              logo: getStockLogoURL(symbol),
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching stock ${symbol}:`, error);
          return null;
        }
      });

      const results = await Promise.all(stockPromises);
      setStocks(results.filter((stock): stock is StockCardType => stock !== null));
      setLoading(false);
    }

    fetchStocks();
  }, []);
  return (
    <div className="container is-fluid" style={{ padding: '2rem' }}>
      <section className="hero is-primary mb-6">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-1">Stock Market Dashboard</h1>
            <h2 className="subtitle">Near real-time stock market information</h2>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="columns is-multiline">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="column is-one-quarter-desktop is-one-third-tablet is-large-mobile">
              <StockCard stock={stock} />
            </div>
          ))}
        </div>
      )}
      {!loading && stocks.length === 0 && (
        <div className="notification is-warning">
          <p>Error getting stock data</p>
        </div>
      )}
    </div>
  );
}
