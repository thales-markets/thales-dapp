export const getCurrencyKeyStableBalance = (balanceData, currencyKey) => {
    if (!balanceData) {
        return null;
    }
    return balanceData[currencyKey]?.balance ? balanceData[currencyKey]?.balance : 0;
};
