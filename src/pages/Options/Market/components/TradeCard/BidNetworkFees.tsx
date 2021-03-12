import React from 'react';
import { OptionsTransaction } from 'types/options';

type BidNetworkFeesProps = {
    className?: string;
    gasLimit: number | null;
    type?: OptionsTransaction['type'];
    fees: Record<string, number> | null;
    amount: string | number;
};

const BidNetworkFees: React.FC<BidNetworkFeesProps> = () => {
    return <span>Network Fees</span>;
};

export default BidNetworkFees;
