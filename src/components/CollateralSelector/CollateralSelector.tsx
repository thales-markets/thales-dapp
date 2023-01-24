import React from 'react';
import {
    AssetContainer,
    CollateralIcon,
    CollateralName,
    Container,
    Label,
    LabelValueContainer,
} from './styled-components';
// import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { getAssetIcon } from 'utils/currency';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setSelectedCollateral } from 'redux/modules/wallet';

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
    const { t } = useTranslation();
    const dispatch = useDispatch();
    return (
        <Container>
            <LabelValueContainer>
                <Label>{t('amm.pay-with')}</Label>
                <CollateralName>{collateralArray[selectedItem]}</CollateralName>
            </LabelValueContainer>
            <AssetContainer>
                {collateralArray.length &&
                    collateralArray.map((item, index) => {
                        const AssetIcon = getAssetIcon(item);
                        return (
                            <CollateralIcon active={selectedItem == index} key={index}>
                                <AssetIcon
                                    key={index}
                                    onClick={() => {
                                        onChangeCollateral(index);
                                        dispatch(setSelectedCollateral(index));
                                    }}
                                    style={{
                                        ...(selectedItem == index
                                            ? {
                                                  opacity: '1',
                                              }
                                            : {
                                                  opacity: '0.5',
                                              }),
                                        marginRight: 7,
                                        width: '40px',
                                        height: '40px',
                                    }}
                                />
                            </CollateralIcon>
                        );
                    })}
            </AssetContainer>
        </Container>
    );
};

export default CollateralSelector;
