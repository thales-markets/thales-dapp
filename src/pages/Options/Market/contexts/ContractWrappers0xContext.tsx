import React, { createContext, useContext } from 'react';
import { ContractWrappers } from '@0x/contract-wrappers';

const ContractWrappers0xContext = createContext<ContractWrappers | null>(null);

type ContractWrappers0xContextProps = {
    children: React.ReactNode;
    contractWrappers0x: ContractWrappers;
};

export const ContractWrappers0xProvider: React.FC<ContractWrappers0xContextProps> = ({
    children,
    contractWrappers0x,
}) => <ContractWrappers0xContext.Provider value={contractWrappers0x}>{children}</ContractWrappers0xContext.Provider>;

export const useContractWrappers0xContext = () => useContext(ContractWrappers0xContext) as ContractWrappers;
