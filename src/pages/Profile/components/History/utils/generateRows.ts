const WIN_COLOR = '#50CE99';
const LOSE_COLOR = '#C3244A';

const generateDateKey = (date: Date) => {
    const dayOfTheWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date.getDay()); //TODO: add different languages
    const dayOfTheMonth = date.getDate();
    const year = date.getFullYear();
    return `${dayOfTheWeek} ${dayOfTheMonth}, ${year}`;
};

const generateRows = (data: any[], walletAddress: string | null) => {
    const dateMap: Record<string, any> = {};

    data.filter(
        (d) =>
            d.maker.toLowerCase() == walletAddress?.toLowerCase() ||
            d.taker.toLowerCase() == walletAddress?.toLowerCase()
    ).forEach((trade) => {
        const tradeDateKey = generateDateKey(new Date(trade.timestamp));
        if (!dateMap[tradeDateKey]) {
            dateMap[tradeDateKey] = [];
        }
        dateMap[tradeDateKey].push(trade);
    });

    const rows = Object.keys(dateMap).reduce((prev: any[], curr: string) => {
        prev.push(curr);
        prev.push(...dateMap[curr]);
        return prev;
    }, []);

    return rows.map((d) => {
        if (typeof d === 'string') {
            return d;
        }
        return {
            color: d.marketItem.result ? (d.marketItem.result === d.optionSide ? WIN_COLOR : LOSE_COLOR) : '',
            asset: {
                currencyKey: d.marketItem.currencyKey,
                assetNameFontSize: '12px',
                currencyKeyFontSize: '12px',
            },
            cells: [
                { title: d.orderSide, value: new Date(d.timestamp).toDateString() },
                { title: 'strike', value: d.marketItem.strikePrice },
                {
                    title: 'price',
                    value: (d.orderSide == 'sell'
                        ? d.takerAmount / d.makerAmount
                        : d.makerAmount / d.takerAmount
                    ).toFixed(2),
                },
                {
                    title: 'amount',
                    value: `${d.orderSide == 'sell' ? d.takerAmount : d.makerAmount} ${d.optionSide}`,
                },
                {
                    title: 'paid',
                    value: (d.orderSide == 'sell' ? d.makerAmount : d.takerAmount).toFixed(2),
                },
                { title: 'expires @', value: new Date(d.marketItem.maturityDate).toDateString() },
            ],
        };
    });
};

export default generateRows;
