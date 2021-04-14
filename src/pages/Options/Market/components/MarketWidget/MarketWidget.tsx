import { MarketWidgetKey } from 'constants/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setMarketWidgetVisibility } from 'redux/modules/ui';
import { Icon } from 'semantic-ui-react';
type MarketWidgetProps = {
    children: React.ReactNode;
    widgetKey: MarketWidgetKey;
};

export const MarketWidget: React.FC<MarketWidgetProps> = ({ children, widgetKey }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <>
            <section
                style={{
                    padding: '8px 8px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                <header className="grid-component-header">
                    <div>{t(`options.market.widgets.${widgetKey}`)}</div>
                    <Icon
                        name="close"
                        onClick={() =>
                            dispatch(setMarketWidgetVisibility({ marketWidget: widgetKey, isVisible: false }))
                        }
                    />
                </header>
                <div style={{ overflow: 'auto', height: '100%', border: '1px solid #bbb', padding: '8px' }}>
                    {children}
                </div>
            </section>
        </>
    );
};

export default MarketWidget;
