import { USD_SIGN } from 'constants/currency';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useCallback, useMemo, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch } from 'react-redux';
import { setSelectedCollateralIndex } from 'redux/modules/wallet';
import styled from 'styled-components';
import { FlexDivSpaceBetween, FlexDivColumnCentered, FlexDivRowCentered, FlexDivStart } from 'styles/common';
import { Coins } from 'types/options';
import { isStableCurrency } from 'utils/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';

type CollateralSelectorProps = {
    collateralArray: Array<string>;
    selectedItem: number;
    onChangeCollateral: (index: number) => void;
    disabled?: boolean;
    isDetailedView?: boolean;
    collateralBalances?: any;
    exchangeRates?: Rates | null;
    dropDownWidth?: string;
};

const CollateralSelector: React.FC<CollateralSelectorProps> = ({
    collateralArray,
    selectedItem,
    onChangeCollateral,
    disabled,
    isDetailedView,
    collateralBalances,
    exchangeRates,
    dropDownWidth,
}) => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const getUSDForCollateral = useCallback(
        (collateral: Coins) =>
            (collateralBalances ? collateralBalances[collateral] : 0) *
            (isStableCurrency(collateral as Coins) ? 1 : exchangeRates?.[collateral] || 0),
        [collateralBalances, exchangeRates]
    );

    const collateralsDetailsSorted = useMemo(() => {
        if (!isDetailedView) {
            return collateralArray;
        }
        return collateralArray.sort((a, b) => getUSDForCollateral(b as Coins) - getUSDForCollateral(a as Coins));
    }, [collateralArray, isDetailedView, getUSDForCollateral]);

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
                          <DetailedDropdown width={dropDownWidth} onClick={() => setOpen(!open)}>
                              {collateralsDetailsSorted.map((collateral, index) => {
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
                                                  {formatCurrencyWithSign(
                                                      null,
                                                      collateralBalances ? collateralBalances[collateral] : 0
                                                  )}
                                              </TextCollateral>
                                              <TextCollateral fontWeight="800">
                                                  {!exchangeRates?.[collateral] &&
                                                  !isStableCurrency(collateral as Coins)
                                                      ? '...'
                                                      : ` (${formatCurrencyWithSign(
                                                            USD_SIGN,
                                                            getUSDForCollateral(collateral as Coins)
                                                        )})`}
                                              </TextCollateral>
                                          </div>
                                      </DetailedCollateralOption>
                                  );
                              })}
                          </DetailedDropdown>
                      )
                    : open && (
                          <Dropdown width={dropDownWidth} onClick={() => setOpen(!open)}>
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
    min-width: 45px;
`;

const Arrow = styled.i`
    font-size: 10px;
    text-transform: none;
    color: ${(props) => props.theme.textColor.primary};
`;

const SelectedCollateral = styled(FlexDivRowCentered)<{ disabled: boolean }>`
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

const Dropdown = styled(FlexDivColumnCentered)<{ width?: string }>`
    position: absolute;
    top: 30px;
    left: -7px;
    width: ${(props) => (props.width ? props.width : '71px')};
    padding: 5px 3px;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
`;

const DetailedDropdown = styled(FlexDivColumnCentered)<{ width?: string }>`
    position: absolute;
    top: 35px;
    right: -9px;
    width: ${(props) => (props.width ? props.width : '350px')};
    padding: 5px 3px;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
`;

const CollateralOption = styled.div`
    display: flex;
    align-items: center;
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
