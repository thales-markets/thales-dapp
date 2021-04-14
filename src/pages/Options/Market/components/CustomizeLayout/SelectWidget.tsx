import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'semantic-ui-react';
import { MarketWidgetKey } from 'constants/ui';
import { getMarketWidgetVisibilityMap, setMarketWidgetVisibility } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import { isMarketWidgetVisible } from 'utils/options';
import { getIsWalletConnected } from 'redux/modules/wallet';

type SelectWidgetProps = {
    widgetKey: MarketWidgetKey;
    phase: string;
};

const SelectWidget: React.FC<SelectWidgetProps> = ({ widgetKey, phase }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const widgetVisibilityMap = useSelector((state: RootState) => getMarketWidgetVisibilityMap(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return isMarketWidgetVisible(widgetKey, widgetVisibilityMap, phase, isWalletConnected, true) ? (
        <Checkbox
            label={t(`options.market.widgets.${widgetKey}`)}
            checked={widgetVisibilityMap[widgetKey]}
            value={widgetVisibilityMap[widgetKey].toString()}
            onChange={(_, data) =>
                dispatch(setMarketWidgetVisibility({ marketWidget: widgetKey, isVisible: data.checked || false }))
            }
        />
    ) : null;
};

export default SelectWidget;
