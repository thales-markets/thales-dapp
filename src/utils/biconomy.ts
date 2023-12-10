import { IHybridPaymaster, PaymasterFeeQuote, PaymasterMode, SponsorUserOperationDto } from '@biconomy/paymaster';
import { PARTICAL_LOGINS_CLASSNAMES } from 'constants/wallet';
import { Network } from 'enums/network';
import { Contract, ethers } from 'ethers';
import { ParticalTypes } from 'types/wallet';
import { Connector } from 'wagmi';
import biconomyConnector from './biconomyWallet';
import { getCollateralsAA } from './currency';
import { getNetworkNameByNetworkId } from './network';

export const executeBiconomyTransaction = async (
    collateral: string,
    contract: Contract | undefined,
    methodName: string,
    data?: ReadonlyArray<any>
): Promise<ethers.providers.TransactionReceipt | undefined> => {
    console.log('collateral: ', collateral);
    console.log('methodName: ', methodName);
    if (biconomyConnector.wallet && contract) {
        // const managerModuleAddr = DEFAULT_SESSION_KEY_MANAGER_MODULE;

        // // get session key from local storage
        // const sessionKeyPrivKey = window.localStorage.getItem('sessionPKey');

        // console.log('sessionKeyPrivKey', sessionKeyPrivKey);
        // if (!sessionKeyPrivKey) {
        //     console.log('errore');
        // }
        // const sessionSigner = new ethers.Wallet(sessionKeyPrivKey as string);
        // console.log('sessionSigner', sessionSigner);

        // // generate sessionModule
        // const sessionModule = await SessionKeyManagerModule.create({
        //     moduleAddress: managerModuleAddr,
        //     smartAccountAddress: biconomyConnector.wallet.accountAddress as string,
        // });

        // // set active module to sessionModule
        // biconomyConnector.wallet = biconomyConnector.wallet.setActiveValidationModule(sessionModule);
        console.log('populate transaction');
        let populatedTx;
        if (data) {
            populatedTx = await contract.populateTransaction[methodName](...data);
        } else {
            populatedTx = await contract.populateTransaction[methodName]();
        }

        const transaction = {
            to: contract.address,
            data: populatedTx.data,
        };

        // const userOperation = await biconomyConnector.wallet.buildUserOp([transaction], {
        //     skipBundlerGasEstimation: false,
        //     params: {
        //         sessionSigner: sessionSigner,
        //         sessionValidationModule: OVERTIMEVM,
        //     },
        // });

        console.log('build userOP');
        const userOperation = await biconomyConnector.wallet.buildUserOp([transaction], {
            skipBundlerGasEstimation: false,
        });

        const biconomyPaymaster = biconomyConnector.wallet.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
        console.log('get paymaster quotes');
        const buyFeeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(userOperation, {
            mode: PaymasterMode.ERC20,
            tokenList: [collateral], // collateral for paying gas
        });

        console.log('paymaster quotes: ', buyFeeQuotesResponse);

        const feeQuotesBuy = buyFeeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
        const spenderBuy = buyFeeQuotesResponse.tokenPaymasterAddress || '';

        const finalUserOp = await biconomyConnector.wallet.buildTokenPaymasterUserOp(userOperation, {
            feeQuote: feeQuotesBuy[0],
            spender: spenderBuy,
            maxApproval: true,
        });

        console.log('buildTokenPaymasterUserOp');

        const paymasterServiceData = {
            mode: PaymasterMode.ERC20,
            feeTokenAddress: feeQuotesBuy[0].tokenAddress,
            calculateGasLimits: true, // Always recommended to be true and especially when using token paymaster
        };

        try {
            const paymasterAndDataWithLimits = await biconomyPaymaster.getPaymasterAndData(
                finalUserOp,
                paymasterServiceData
            );
            finalUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;
            if (
                paymasterAndDataWithLimits.callGasLimit &&
                paymasterAndDataWithLimits.verificationGasLimit &&
                paymasterAndDataWithLimits.preVerificationGas
            ) {
                // Returned gas limits must be replaced in your op as you update paymasterAndData.
                // Because these are the limits paymaster service signed on to generate paymasterAndData
                // If you receive AA34 error check here..

                finalUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
                finalUserOp.verificationGasLimit = paymasterAndDataWithLimits.verificationGasLimit;
                finalUserOp.preVerificationGas = paymasterAndDataWithLimits.preVerificationGas;
            }
        } catch (e) {
            console.log('error received ', e);
        }

        console.log('signUserOp');

        const signedUserOp = await biconomyConnector.wallet.signUserOp(finalUserOp);
        const response = await biconomyConnector.wallet.sendSignedUserOp(signedUserOp);
        // const response = await biconomyConnector.wallet.sendUserOp(finalUserOp, {
        //     sessionSigner: sessionSigner,
        //     sessionValidationModule: OVERTIMEVM,
        // });
        const receipt = (await response.wait(1)).receipt;
        console.log('receipt: ', receipt);
        return receipt;
    }
};

export const getGasFeesForTx = async (
    collateral: string,
    contract: Contract | undefined,
    methodName: string,
    data?: ReadonlyArray<any>
): Promise<number | undefined> => {
    if (biconomyConnector.wallet && contract) {
        // // get session key from local storage
        // const sessionKeyPrivKey = window.localStorage.getItem('sessionPKey');

        // console.log('sessionKeyPrivKey', sessionKeyPrivKey);
        // if (!sessionKeyPrivKey) {
        //     console.log('errore');
        // }
        // const sessionSigner = new ethers.Wallet(sessionKeyPrivKey as string);
        // console.log('sessionSigner', sessionSigner);

        let populatedTx;
        if (data) {
            populatedTx = await contract.populateTransaction[methodName](...data);
        } else {
            populatedTx = await contract.populateTransaction[methodName]();
        }

        const transaction = {
            to: contract.address,
            data: populatedTx.data,
        };

        // {
        //     skipBundlerGasEstimation: false,
        //     params: {
        //         sessionSigner: sessionSigner,
        //         sessionValidationModule: OVERTIMEVM,
        //     },
        // }

        const userOperation = await biconomyConnector.wallet.buildUserOp([transaction], {
            skipBundlerGasEstimation: false,
        });

        const biconomyPaymaster = biconomyConnector.wallet.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

        const buyFeeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(userOperation, {
            mode: PaymasterMode.ERC20,
            tokenList: [collateral], // collateral for paying gas
        });

        const feeQuotesBuy = buyFeeQuotesResponse.feeQuotes as PaymasterFeeQuote[];

        return feeQuotesBuy[0] ? feeQuotesBuy[0].maxGasFee : 0;
    }
};

export const getClassNameForParticalLogin = (socialId: ParticalTypes) => {
    const label = PARTICAL_LOGINS_CLASSNAMES.find((item) => item.socialId == socialId)?.className;
    return label ? label : '';
};

export const getOnRamperUrl = (apiKey: string, walletAddress: string, networkId: Network, selectedToken: number) => {
    return `https://buy.onramper.com?apiKey=${apiKey}&mode=buy&onlyCryptos=${
        getCollateralsAA(networkId, true)[selectedToken]
    }_${getNetworkNameByNetworkId(networkId, true)}&networkWallets=${getNetworkNameByNetworkId(
        networkId,
        true
    )}:${walletAddress}'&themeName=dark&containerColor=181a20&primaryColor=1D976C&secondaryColor=2b3139&cardColor=2b3139&primaryTextColor=ffffff&secondaryTextColor=848e9c&borderRadius=0.5&wgBorderRadius=1'`;
};

export const getSpecificConnectorFromConnectorsArray = (
    connectors: Connector[],
    name: string,
    particle?: boolean
): Connector | undefined => {
    if (particle) {
        return connectors.find((connector: any) => connector?.options?.authType == name);
    }
    return connectors.find((connector: any) => connector.id == name);
};
