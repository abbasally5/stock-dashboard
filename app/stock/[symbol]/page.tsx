'use client';

import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import PriceChart from "@/app/components/PriceChart";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SymbolMap } from "@/app/constants/constants";
import { processTimeSeriesData, checkNAValue, getStockLogoURL } from "@/app/utils/utils";
import { CompanyOverview, StockPriceData } from "@/app/types/stocks";

export default function StockInfoPage() {
    const params = useParams();
    const symbol = params.symbol;

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<CompanyOverview | null>(null);
    const [priceData, setPriceData] = useState<StockPriceData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch company overview and time series in parallel
                const [overviewRes, timeseriesRes] = await Promise.all([
                    fetch(`/api/stockdata/overview?symbol=${symbol}`),
                    fetch(`/api/stockdata/timeseries?symbol=${symbol}&outputsize=full`),
                ]);

                if (!overviewRes.ok || !timeseriesRes.ok) {
                    throw new Error('Failed to fetch stock data');
                }

                const overviewData = await overviewRes.json();
                const timeseriesData = await timeseriesRes.json();

                // Check for API errors
                if (overviewData['Error Message'] || timeseriesData['Error Message']) {
                    throw new Error(overviewData['Error Message'] || timeseriesData['Error Message'] || 'API error');
                }

                setOverview(overviewData);

                if (timeseriesData['Time Series (Daily)']) {
                    const processed = processTimeSeriesData(timeseriesData['Time Series (Daily)']);
                    setPriceData(processed);
                }
            } catch (err) {
                console.error('Error fetching stock data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load stock data');
            } finally {
                setLoading(false);
            }
        };

        if (symbol === null) {
            setError('No stock specified')
        }
        else if (!SymbolMap[String(symbol)]) {
            setError(`Specified stock ${symbol} is not part of the curated set of stocks we offer data for`)
        } else {
            fetchData();
        }

    }, [symbol]);

    if (loading) {
        return <LoadingSpinner />;
    }
    if (error || !overview) {

        return (
            <div className="notification is-warning">
                <p>Error getting stock data</p>
                <p>{error}</p>
            </div>
        );
    }
    // TODO: account for stock split
    const isPositive = priceData.length > 0 && priceData[30]
        ? priceData[0].close - priceData[30].close >= 0
        : true;

    return (
        <div className="container is-fluid" style={{ padding: '2rem' }}>
            {/* Header with back button */}
            <div className="mb-5">
                <Link href="/" className="button is-light">
                    ← Back to Home
                </Link>
            </div>

            {/* Company Header */}
            <section className="hero is-primary mb-6">
                <div className="hero-body">
                    <div className="container">
                        <div className="media">
                            <div className="media-left">
                                <figure className="image is-128x128">
                                    <Image
                                        src={getStockLogoURL(String(symbol))}
                                        alt={String(symbol)}
                                        width={128}
                                        height={128}
                                        className="is-rounded"
                                    />
                                </figure>
                            </div>
                            <div className="media-content">
                                <h1 className="title is-1">{overview.Symbol || symbol}</h1>
                                <h2 className="subtitle is-4">{checkNAValue(overview.Name)}</h2>
                                <p className="subtitle is-6 has-text-grey-dark">
                                    {checkNAValue(overview.Exchange)} • {checkNAValue(overview.Sector)} • {checkNAValue(overview.Industry)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Overview Card */}
            <div className="card mb-6">
                <div className="card-header">
                    <p className="card-header-title">Company Overview</p>
                </div>
                <div className="card-content">
                    <div className="content">
                        <div className="columns is-multiline">
                            <div className="column is-half-tablet is-one-third-desktop">
                                <p><strong>Symbol:</strong> {checkNAValue(overview.Symbol)}</p>
                            </div>
                            <div className="column is-half-tablet is-one-third-desktop">
                                <p><strong>Asset Type:</strong> {checkNAValue(overview.AssetType)}</p>
                            </div>
                            <div className="column is-half-tablet is-one-third-desktop">
                                <p><strong>Name:</strong> {checkNAValue(overview.Name)}</p>
                            </div>
                            <div className="column is-half-tablet is-one-third-desktop">
                                <p><strong>Exchange:</strong> {checkNAValue(overview.Exchange)}</p>
                            </div>
                            <div className="column is-half-tablet is-one-third-desktop">
                                <p><strong>Sector:</strong> {checkNAValue(overview.Sector)}</p>
                            </div>
                            <div className="column is-half-tablet is-one-third-desktop">
                                <p><strong>Industry:</strong> {checkNAValue(overview.Industry)}</p>
                            </div>
                            <div className="column is-full">
                                <p><strong>Description:</strong></p>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    {checkNAValue(overview.Description)}
                                </p>
                            </div>
                            <div className="column is-half-tablet is-one-third-desktop">
                                <p><strong>Market Capitalization:</strong> {overview.MarketCapitalization}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Chart */}
            {priceData.length > 0 && (
                <div className="card mb-6">
                    <div className="card-header">
                        <p className="card-header-title">Price History (Last 30 Days)</p>
                    </div>
                    <div className="card-content">
                        <PriceChart data={priceData} isPositive={isPositive} />
                    </div>
                </div>
            )}

            {/* Historical Prices Table */}
            {priceData.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <p className="card-header-title">Historical Prices</p>
                    </div>
                    <div className="card-content">
                        <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <table className="table is-striped is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Close Price</th>
                                        <th>Volume</th>
                                        <th>Change %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priceData.map((data, index) => {
                                        const isRowPositive = data.changePercent >= 0;
                                        return (
                                            <tr key={index}>
                                                <td>{new Date(data.date).toLocaleDateString()}</td>
                                                <td>{data.close.toString()}</td>
                                                <td>{data.volume.toString()}</td>
                                                <td className={isRowPositive ? 'has-text-success' : 'has-text-danger'}>
                                                    {isRowPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {priceData.length === 0 && (
                <div className="notification is-warning">
                    <p>No historical price data available for this stock.</p>
                </div>
            )}
        </div>
    );
}