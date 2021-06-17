import { MarketWidgetKey } from 'constants/ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { resetMarketWidgetVisibilityMap } from 'redux/modules/marketWidgets';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { DefaultSubmitButton } from '../../components';
import SelectWidget from './SelectWidget';
import { ReactComponent as RightIcon } from 'assets/images/right.svg';

type CustomizeLayoutProps = {
    phase: string;
};

export const CustomizeLayout: React.FC<CustomizeLayoutProps> = ({ phase }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [customizeLayoutVisible, setCustomizeLayoutVisible] = useState<boolean>(false);

    return (
        <>
            <FlexDivColumnCentered>
                <CustomizeLayoutButton
                    onClick={() => {
                        setCustomizeLayoutVisible(!customizeLayoutVisible);
                    }}
                    isActive={customizeLayoutVisible}
                >
                    {t('options.market.widgets.button.customize-layout')} <StyledRightIcon />
                </CustomizeLayoutButton>
                {customizeLayoutVisible && (
                    <Container>
                        <DropDown>
                            {Object.values(MarketWidgetKey).map((widgetKey: string) => (
                                <SelectWidget
                                    key={`${widgetKey}-checkbox`}
                                    widgetKey={widgetKey as MarketWidgetKey}
                                    phase={phase}
                                />
                            ))}
                            <ResetButton onClick={() => dispatch(resetMarketWidgetVisibilityMap())}>
                                {t('options.market.widgets.button.reset-layout')}
                            </ResetButton>
                        </DropDown>
                    </Container>
                )}
            </FlexDivColumnCentered>
        </>
    );
};

const CustomizeLayoutButton = styled(DefaultSubmitButton)<{ isActive: boolean }>`
    position: relative;
    width: 180px;
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border: 1px solid ${(props) => (props.isActive ? '#00f9ff' : '#4f759b')};
    border-radius: 32px;
    padding: 8px;
    &:hover:not(:disabled) {
        background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
        border: 1px solid #00f9ff;
    }
`;

const Container = styled.div`
    width: 278px;
    position: relative;
    z-index: 1000;
`;

const DropDown = styled(FlexDivColumn)`
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border: 1px solid #00f9ff;
    box-sizing: border-box;
    border-radius: 32px;
    padding: 20px 30px 25px 30px;
    position: absolute;
    margin-top: 4px;
`;

const StyledRightIcon = styled(RightIcon)`
    margin-bottom: -1px;
    margin-left: 20px;
`;

const ResetButton = styled(DefaultSubmitButton)`
    margin-top: 10px;
`;

export default CustomizeLayout;
