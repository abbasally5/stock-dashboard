'use client';

import Link from 'next/link';
import Image from 'next/image';
import { StockCardType } from '../types/stocks'

interface StockCardProps {
    stock: StockCardType;
}

export default function StockCard({ stock }: StockCardProps) {

    const isPositive = stock.change >= 0;

    return (
        <Link href={`/stock/${stock.symbol}`}>
            <div
                className={`card ${isPositive ? 'has-background-success-light' : 'has-background-danger-light'} is-clickable`}
            >
                <div className="card-content">
                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-64x64">
                                <Image
                                    src={stock.logo}
                                    alt={stock.symbol}
                                    width={64}
                                    height={64}
                                    className="is-rounded"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="title is-5">{stock.symbol}</p>
                            <p className="subtitle is-6 has-text-grey-dark">{stock.name}</p>
                        </div>
                    </div>
                    <div className="content mt-4">
                        <p className="title is-4">
                            ${stock.price.toFixed(2)}
                        </p>
                        <p className={`subtitle is-6 ${isPositive ? 'has-text-success' : 'has-text-danger'}`}>
                            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}