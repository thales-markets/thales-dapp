import React from 'react';
import { AssetContainer, CollateralName, Container, Label, LabelValueContainer } from './styled-components';
// import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { getAssetIcon } from 'utils/currency';

type CollateralSelectorProps = {
    collateralArray: Array<string>;
    selectedItem: number;
    onChangeCollateral: (index: number) => void;
};

const CollateralSelector: React.FC<CollateralSelectorProps> = ({
    collateralArray,
    selectedItem,
    onChangeCollateral,
}) => {
    return (
        <Container>
            <LabelValueContainer>
                <Label>{'Pay with'}</Label>
                <CollateralName>{'usdt'}</CollateralName>
            </LabelValueContainer>
            <AssetContainer>
                {collateralArray.length &&
                    collateralArray.map((item, index) => {
                        const AssetIcon = getAssetIcon(item);
                        return (
                            <AssetIcon
                                key={index}
                                onClick={() => onChangeCollateral(index)}
                                style={{
                                    ...(selectedItem == index
                                        ? {
                                              opacity: '1',
                                              //   boxShadow: 'var(--shadow)',
                                          }
                                        : {
                                              opacity: '0.5',
                                          }),
                                    marginRight: 7,
                                    width: '40px',
                                    height: '40px',
                                }}
                            />
                            // <CollateralIcon
                            //     key={index}
                            //     active={index == selectedItem}
                            //     onClick={() => onChangeCollateral(index)}
                            // >
                            //     <CurrencyIcon
                            //         key={index}
                            //         synthIconStyle={{
                            //             marginRight: '0px !important',
                            //             display: 'flex',
                            //             padding: '2px',
                            //             alignItems: 'center',
                            //         }}
                            //         currencyKey={item}
                            //         width={'50px'}
                            //         height={'50px'}
                            //     />
                            // </CollateralIcon>
                        );
                    })}
            </AssetContainer>
        </Container>
    );
};

export default CollateralSelector;
