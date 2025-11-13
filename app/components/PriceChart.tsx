'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockPriceData } from '../types/stocks';

interface PriceChartProps {
    data: StockPriceData[];
    isPositive: boolean;
}

export default function PriceChart({ data, isPositive }: PriceChartProps) {
    // Reverse data to show oldest to newest
    const chartData = [...data].reverse().slice(-30); // Show last 30 days

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '10px',
                    }}
                >
                    <p style={{ color: 'var(--text-primary)', marginBottom: '5px' }}>
                        {`Date: ${payload[0].payload.date}`}
                    </p>
                    <p style={{ color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
                        {`Price: $${payload[0].value.toFixed(2)}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: '400px', marginTop: '2rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-secondary)"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                    />
                    <YAxis
                        stroke="var(--text-secondary)"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="close"
                        stroke={isPositive ? 'var(--success)' : 'var(--danger)'}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}