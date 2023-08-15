import { USD_SIGN } from 'constants/currency';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch } from 'react-redux';
import { setSelectedCollateralIndex } from 'redux/modules/wallet';
import styled from 'styled-components';
import {
    FlexDivSpaceBetween,
    FlexDivColumnCentered,
    FlexDivRowCentered,
    FlexDivStart,
    FlexDivCentered,
} from 'styles/common';
import { formatCurrencyWithSign } from 'utils/formatters/number';

type CollateralSelectorProps = {
    collateralArray: Array<string>;
    selectedItem: number;
    onChangeCollateral: (index: number) => void;
    disabled?: boolean;
    isDetailedView?: boolean;
    collateralBalances?: any;
    exchangeRates?: Rates | null;
};

const CollateralSelector: React.FC<CollateralSelectorProps> = ({
    collateralArray,
    selectedItem,
    onChangeCollateral,
    disabled,
    isDetailedView,
    collateralBalances,
    exchangeRates,
}) => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    return (
        <Container>
            <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
                <SelectedCollateral disabled={!!disabled} onClick={() => !disabled && setOpen(!open)}>
                    <TextCollateralWrapper>
                        <TextCollateral>{collateralArray[selectedItem]}</TextCollateral>
                    </TextCollateralWrapper>
                    <Arrow className={open ? `icon icon--caret-up` : `icon icon--caret-down`} />
                </SelectedCollateral>
                {isDetailedView
                    ? open && (
                          <DetailedDropdown onClick={() => setOpen(!open)}>
                              {collateralArray.map((collateral, index) => {
                                  return (
                                      <DetailedCollateralOption
                                          key={index}
                                          onClick={() => {
                                              onChangeCollateral(index);
                                              dispatch(setSelectedCollateralIndex(index));
                                          }}
                                      >
                                          <div>
                                              <Icon
                                                  className={`currency-icon currency-icon--${collateral.toLowerCase()}`}
                                              />
                                              <TextCollateral fontWeight="400">{collateral}</TextCollateral>
                                          </div>
                                          <div>
                                              <TextCollateral fontWeight="400">
                                                  {formatCurrencyWithSign(null, collateralBalances[collateral])}
                                              </TextCollateral>
                                              <TextCollateral fontWeight="800">
                                                  {` (${formatCurrencyWithSign(
                                                      USD_SIGN,
                                                      collateralBalances[collateral] *
                                                          (exchangeRates?.[collateral] || 0)
                                                  )})`}
                                              </TextCollateral>
                                          </div>
                                      </DetailedCollateralOption>
                                  );
                              })}
                          </DetailedDropdown>
                      )
                    : open && (
                          <Dropdown onClick={() => setOpen(!open)}>
                              {collateralArray.map((collateral, index) => {
                                  return (
                                      <CollateralOption
                                          key={index}
                                          onClick={() => {
                                              onChangeCollateral(index);
                                              dispatch(setSelectedCollateralIndex(index));
                                          }}
                                      >
                                          <TextCollateral>{collateral}</TextCollateral>
                                      </CollateralOption>
                                  );
                              })}
                          </Dropdown>
                      )}
            </OutsideClickHandler>
        </Container>
    );
};

const Container = styled(FlexDivStart)`
    position: relative;
    margin: 0 7px;
    align-items: center;
    z-index: 2;
`;

const Text = styled.span<{ fontWeight?: string }>`
    font-style: normal;
    font-weight: ${(props) => (props.fontWeight ? props.fontWeight : '600')};
    font-size: 13px;
    line-height: 20px;
`;

const TextCollateral = styled(Text)`
    color: ${(props) => props.theme.textColor.primary};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const TextCollateralWrapper = styled.div`
    min-width: 40px;
`;

const Arrow = styled.i`
    font-size: 10px;
    text-transform: none;
    color: ${(props) => props.theme.textColor.primary};
`;

const SelectedCollateral = styled(FlexDivRowCentered)<{ disabled: boolean }>`
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

const Dropdown = styled(FlexDivColumnCentered)`
    position: absolute;
    top: 30px;
    left: -7px;
    width: 66px;
    padding: 5px 3px;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
`;

const DetailedDropdown = styled(FlexDivColumnCentered)`
    position: absolute;
    top: 35px;
    right: -9px;
    width: 350px;
    padding: 5px 3px;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
`;

const CollateralOption = styled(FlexDivCentered)`
    padding: 5px 7px;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
`;

const DetailedCollateralOption = styled(FlexDivSpaceBetween)`
    padding: 5px 24px;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background: ${(props) => props.theme.background.primary};
    }
`;

const Icon = styled.i`
    font-size: 25px;
    line-height: 100%;
    margin-right: 10px;
`;

export default CollateralSelector;
