import React, { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { ContractWrappers } from '@0x/contract-wrappers';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import TradeOptions from './TradeOptions';
import { ContractWrappers0xProvider } from '../contexts/ContractWrappers0xContext';

declare const window: any;

const TradeOptionsContainer: React.FC = () => {
    const [contractWrappers0x, setContractWrappers0x] = useState<ContractWrappers>();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    useEffect(() => {
        setContractWrappers0x(
            new ContractWrappers(window.ethereum, {
                chainId: networkId,
            })
        );
    }, [networkId]);

    return contractWrappers0x ? (
        <ContractWrappers0xProvider contractWrappers0x={contractWrappers0x}>
            <TradeOptions />
        </ContractWrappers0xProvider>
    ) : (
        <Loader active />
    );
};

export default TradeOptionsContainer;
