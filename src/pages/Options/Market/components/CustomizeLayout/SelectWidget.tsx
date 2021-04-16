import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'semantic-ui-react';
import { MarketWidgetKey } from 'constants/ui';
import { getVisibilityMap, setMarketWidgetVisibility } from 'redux/modules/marketWidgets';
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
    const visibilityMap = useSelector((state: RootState) => getVisibilityMap(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return isMarketWidgetVisible(widgetKey, visibilityMap, phase, isWalletConnected, true) ? (
        <Checkbox
            label={t(`options.market.widgets.${widgetKey}`)}
            checked={visibilityMap[widgetKey]}
            value={visibilityMap[widgetKey].toString()}
            onChange={(_, data) =>
                dispatch(setMarketWidgetVisibility({ marketWidget: widgetKey, isVisible: data.checked || false }))
            }
        />
    ) : null;
};

export default SelectWidget;
