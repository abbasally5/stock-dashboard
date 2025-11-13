
export interface TimeSeriesDaily {
    [date: string]: {
        '1. open': string;
        '2. high': string;
        '3. low': string;
        '4. close': string;
        '5. volume': string;
    };
}

export interface StockPriceData {
    date: string;
    close: number;
    volume: number;
    changePercent: number;
}

export interface StockCardType {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    logo: string;
}

export interface CompanyOverview {
    Symbol: string;
    AssetType: string;
    Name: string;
    Description: string;
    CIK: string;
    Exchange: string;
    Currency: string;
    Country: string;
    Sector: string;
    Industry: string;
    Address: string;
    FullTimeEmployees: string;
    FiscalYearEnd: string;
    LatestQuarter: string;
    MarketCapitalization: string;
    EBITDA: string;
    PERatio: string;
    PEGRatio: string;
    BookValue: string;
    DividendPerShare: string;
    DividendYield: string;
    EPS: string;
    RevenuePerShareTTM: string;
    ProfitMargin: string;
    OperatingMarginTTM: string;
    ReturnOnAssetsTTM: string;
    ReturnOnEquityTTM: string;
    RevenueTTM: string;
    GrossProfitTTM: string;
    DilutedEPSTTM: string;
    QuarterlyEarningsGrowthYOY: string;
    QuarterlyRevenueGrowthYOY: string;
    AnalystTargetPrice: string;
    TrailingPE: string;
    ForwardPE: string;
    PriceToSalesRatioTTM: string;
    PriceToBookRatio: string;
    EVToRevenue: string;
    EVToEBITDA: string;
    Beta: string;
    '52WeekHigh': string;
    '52WeekLow': string;
    '50DayMovingAverage': string;
    '200DayMovingAverage': string;
    SharesOutstanding: string;
    DividendDate: string;
    ExDividendDate: string;
}

export interface StockPriceData {
    date: string;
    close: number;
    volume: number;
    changePercent: number;
}