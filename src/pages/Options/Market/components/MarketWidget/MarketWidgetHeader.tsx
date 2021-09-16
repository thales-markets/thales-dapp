import { MarketWidgetKey } from 'constants/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setMarketWidgetVisibility } from 'redux/modules/marketWidgets';
import styled from 'styled-components';
import { FlexDivRowCentered } from 'theme/common';
import { ReactComponent as CloseIcon } from 'assets/images/close.svg';

type MarketWidgetHeaderProps = {
    widgetKey: MarketWidgetKey;
    children?: React.ReactNode;
    title?: string;
};

export const MarketWidgetHeader: React.FC<MarketWidgetHeaderProps> = ({ widgetKey, children, title }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <WidgetHeader className="grid-component-header">
            <WidgetTitle>{title || t(`options.market.widgets.${widgetKey}`)}</WidgetTitle>
            <FlexDivRowCentered>
                {children}
                <CloseIconContainer
                    className="xBtn"
                    onClick={() => dispatch(setMarketWidgetVisibility({ marketWidget: widgetKey, isVisible: false }))}
                />
            </FlexDivRowCentered>
        </WidgetHeader>
    );
};

const WidgetHeader = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    min-height: 50px;
    border-bottom: 1px solid rgba(228, 228, 228, 0.1);
    padding: 0px 20px 0 30px;
`;

const WidgetTitle = styled.div``;

const CloseIconContainer = styled(CloseIcon)`
    :hover {
        cursor: pointer;
    }
`;

export default MarketWidgetHeader;
