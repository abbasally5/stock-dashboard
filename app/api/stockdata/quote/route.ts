import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const response = await fetch(url);
        var data = await response.json();
        if (data['Information'] || data['Note']) {
            console.error('API key has reached it\'s rate limit')
            const file = await fs.readFile(process.cwd() + '/app/api/stockdata/mockdata/global_quote.json', 'utf8');
            data = JSON.parse(file);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching quote:', error);
        return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
    }
}

