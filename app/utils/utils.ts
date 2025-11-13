
import { SymbolMap } from "../constants/constants";
import { TimeSeriesDaily, StockPriceData } from "../types/stocks";

export function getStockLogoURL(symbol: string): string {
    const domain = SymbolMap[symbol] || `tensorwave.com`;
    return `https://img.logo.dev/${domain}?token=pk_GRLB8T5-RP6i7rMZKmSb8A`;
}

export function processTimeSeriesData(timeSeries: TimeSeriesDaily): StockPriceData[] {
    const dates = Object.keys(timeSeries).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    return dates.map((date, index) => {
        const current = timeSeries[date];
        const currentClose = parseFloat(current['4. close']);
        const previousDate = dates[index + 1];
        let changePercent = 0;

        if (previousDate) {
            const previousClose = parseFloat(timeSeries[previousDate]['4. close']);
            changePercent = ((currentClose - previousClose) / previousClose) * 100;
        }

        return {
            date,
            close: currentClose,
            volume: parseInt(current['5. volume']),
            changePercent,
        };
    });
}

export function checkNAValue(value: string | undefined): string {
    if (!value || value === 'None' || value === '') return 'N/A';
    return value;
}