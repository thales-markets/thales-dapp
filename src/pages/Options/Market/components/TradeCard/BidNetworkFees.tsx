import React from 'react';
import { OptionsTransaction } from 'types/options';

type NetworkFeesProps = {
    className?: string;
    gasLimit: number | null;
    type?: OptionsTransaction['type'];
    fees: Record<string, number> | null;
    amount: string | number;
};

const NetworkFees: React.FC<NetworkFeesProps> = () => {
    return <span>Network Fees</span>;
};

export default NetworkFees;
