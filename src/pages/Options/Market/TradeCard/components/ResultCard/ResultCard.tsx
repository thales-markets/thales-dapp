import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { Side } from 'types/options';
import OptionResult from '../OptionResult';

type ResultCardProps = {
    icon: React.ReactNode;
    title: React.ReactNode;
    subTitle: React.ReactNode;
    longAmount: number;
    shortAmount: number;
    longPrice?: number;
    shortPrice?: number;
    result?: Side;
    exercised?: boolean;
    claimableLongAmount?: number;
    claimableShortAmount?: number;
};

const ResultCard: React.FC<ResultCardProps> = ({
    icon,
    title,
    subTitle,
    longAmount,
    shortAmount,
    longPrice,
    shortPrice,
    // result,
    // exercised,
    claimableLongAmount,
    claimableShortAmount,
}) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>{icon}</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
            <Header as="h3" style={{ textTransform: 'uppercase' }}>
                {title}
            </Header>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <span>{subTitle}</span>
        </div>
        <Grid centered>
            <Grid.Column width={6}>
                <OptionResult side="long" amount={longAmount} price={longPrice} claimableAmount={claimableLongAmount} />
            </Grid.Column>
            <Grid.Column width={6}>
                <OptionResult
                    side="short"
                    amount={shortAmount}
                    price={shortPrice}
                    claimableAmount={claimableShortAmount}
                />
            </Grid.Column>
        </Grid>
    </div>
);

export default ResultCard;
