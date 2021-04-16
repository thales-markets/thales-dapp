import { MarketWidgetKey } from 'constants/ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { resetMarketWidgetVisibilityMap } from 'redux/modules/marketWidgets';
import { Button } from 'semantic-ui-react';
import SelectWidget from './SelectWidget';

type CustomizeLayoutProps = {
    phase: string;
};

export const CustomizeLayout: React.FC<CustomizeLayoutProps> = ({ phase }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [customizeLayoutVisible, setCustomizeLayoutVisible] = useState<boolean>(false);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Button
                    size="tiny"
                    onClick={() => {
                        setCustomizeLayoutVisible(!customizeLayoutVisible);
                    }}
                >
                    {t('options.market.widgets.button.customize-layout')}
                </Button>
                {customizeLayoutVisible && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {Object.values(MarketWidgetKey).map((widgetKey: string) => (
                            <SelectWidget
                                key={`${widgetKey}-checkbox`}
                                widgetKey={widgetKey as MarketWidgetKey}
                                phase={phase}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Button size="tiny" onClick={() => dispatch(resetMarketWidgetVisibilityMap())}>
                    {t('options.market.widgets.button.reset-layout')}
                </Button>
            </div>
        </>
    );
};

export default CustomizeLayout;
