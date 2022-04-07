import React from 'react';
import styled from 'styled-components';

import { OrderbookFilterEnum } from 'constants/options';
import Button from 'components/Button';
import { TooltipStyles } from 'constants/ui';
import { Tooltip, withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const orderbookFilterMap = {
    [OrderbookFilterEnum.ALL]: {
        iconClass: 'icon icon--double-arrow',
        label: 'All',
        labeli18: 'options.order-book.filters.all',
    },
    [OrderbookFilterEnum.BUY]: {
        iconClass: 'icon icon--arrow-up',
        label: 'Buy orders',
        labeli18: 'options.order-book.filters.buy-orders',
    },
    [OrderbookFilterEnum.SELL]: {
        iconClass: 'icon icon--arrow-down',
        label: 'Sell orders',
        labeli18: 'options.order-book.filters.sell-orders',
    },
};

type FiltersProps = {
    filter: string;
    onClick: (filter: string) => void;
    userOrderFilter: boolean;
    userOrderFilterTooltipText: string;
    onUserOrderFilterClick: (value: boolean) => void;
};

const Filters: React.FC<FiltersProps> = ({
    filter,
    onClick,
    userOrderFilter,
    userOrderFilterTooltipText,
    onUserOrderFilterClick,
}) => {
    const { t } = useTranslation();

    return (
        <Container>
            {Object.values(OrderbookFilterEnum).map((filterItem) => {
                return (
                    <Button
                        active={filter == filterItem}
                        padding={'9px 12px'}
                        margin={'0px 5px 0px 0px'}
                        fontSize={'12px'}
                        key={filterItem}
                        onClickHandler={() => onClick(filterItem)}
                    >
                        {t(`${orderbookFilterMap[filterItem].labeli18}`)}
                        <Icon className={orderbookFilterMap[filterItem].iconClass} active={filter == filterItem} />
                    </Button>
                );
            })}
            <CustomTooltip title={userOrderFilterTooltipText}>
                <Button
                    active={userOrderFilter == true}
                    padding={'9px 12px'}
                    margin={'0px 5px 0px 15px'}
                    fontSize={'12px'}
                    onClickHandler={() => onUserOrderFilterClick(!userOrderFilter)}
                >
                    {t('options.order-book.filters.sell-orders')}
                    <Icon className={'icon icon--user-avatar'} active={userOrderFilter == true} />
                </Button>
            </CustomTooltip>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;

const Icon = styled.i<{ active?: boolean }>`
    font-size: 12px;
    color: ${(_props) => (_props?.active ? 'var(--button-text-active)' : 'var(--button-text-inactive)')};
    text-transform: initial;
    margin-left: 3px;
`;

const CustomTooltip = withStyles(() => ({
    tooltip: {
        minWidth: '100%',
        width: '100%',
        margin: '0',
        backgroundColor: TooltipStyles.error.backgroundColor,
        color: TooltipStyles.error.color,
        fontSize: TooltipStyles.error.fontSize,
    },
}))(Tooltip);

export default Filters;
