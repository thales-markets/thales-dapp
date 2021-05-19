import { MarketWidgetKey } from 'constants/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setMarketWidgetVisibility } from 'redux/modules/marketWidgets';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { FlexDivRowCentered } from 'theme/common';

type MarketWidgetHeaderProps = {
    widgetKey: MarketWidgetKey;
    children?: React.ReactNode;
};

export const MarketWidgetHeader: React.FC<MarketWidgetHeaderProps> = ({ widgetKey, children }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <WidgetHeader className="grid-component-header">
            <WidgetTitle>{t(`options.market.widgets.${widgetKey}`)}</WidgetTitle>
            <FlexDivRowCentered>
                {children}
                <Icon
                    name="close"
                    onClick={() => dispatch(setMarketWidgetVisibility({ marketWidget: widgetKey, isVisible: false }))}
                    size="small"
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

export default MarketWidgetHeader;
