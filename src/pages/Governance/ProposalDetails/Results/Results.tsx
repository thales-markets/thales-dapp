import React, { useMemo } from 'react';
import { FlexDiv } from 'theme/common';
import { formatPercentage, formatNumberShort } from 'utils/formatters/number';
import {
    ResultLabel,
    Percentage,
    RowPercentage,
    RowPercentageIndicator,
    ResultRow,
    SidebarRowData,
    Votes,
} from 'pages/Governance/components';
import { truncateText } from 'utils/formatters/string';
import styled from 'styled-components';
import { NUMBER_OF_COUNCIL_MEMBERS } from 'constants/governance';
import { LightMediumTooltip } from 'pages/Options/Market/components';

type ResultsProps = {
    proposalChoices: any;
    results: any;
    spaceSymbol: any;
    isCouncilResults?: boolean;
};

const Results: React.FC<ResultsProps> = ({ proposalChoices, results, spaceSymbol, isCouncilResults }) => {
    const choices = useMemo(() => {
        const choices = proposalChoices.map((choice: any, i: number) => ({
            choice,
            i,
        }));
        if (results && results.resultsByVoteBalance) {
            return choices.sort(
                (a: any, b: any) => results.resultsByVoteBalance[b.i] - results.resultsByVoteBalance[a.i]
            );
        }
        return choices;
    }, [results, proposalChoices]);

    return (
        <>
            {choices.map((choice: any, index: number) => {
                const label = truncateText(choice.choice, 12);
                const percentage = results.sumOfResultsBalance
                    ? results.resultsByVoteBalance[choice.i] / results.sumOfResultsBalance
                    : 0;

                return (
                    <ResultRow
                        key={label}
                        backgroundColor={isCouncilResults && index < NUMBER_OF_COUNCIL_MEMBERS ? '#03044e' : '#04045a'}
                        opacity={isCouncilResults && index >= NUMBER_OF_COUNCIL_MEMBERS ? 0.5 : 1}
                        borderColor={
                            isCouncilResults && index === NUMBER_OF_COUNCIL_MEMBERS - 1 ? '#3f1fb4' : undefined
                        }
                        paddingBottom={
                            isCouncilResults &&
                            (index === NUMBER_OF_COUNCIL_MEMBERS - 1 || index === choices.length - 1)
                                ? 20
                                : 10
                        }
                    >
                        <SidebarRowData>
                            <FlexDiv>
                                <LightMediumTooltip title={choice.choice}>
                                    <ResultLabel>{label}</ResultLabel>
                                </LightMediumTooltip>
                                <Votes>{`${formatNumberShort(
                                    results.resultsByVoteBalance[choice.i]
                                )} ${spaceSymbol}`}</Votes>
                            </FlexDiv>
                            <Percentage>{formatPercentage(percentage)}</Percentage>
                        </SidebarRowData>
                        <RowPercentageContainer>
                            <RowPercentage />
                            <RowPercentageIndicator width={percentage * 100}></RowPercentageIndicator>
                        </RowPercentageContainer>
                    </ResultRow>
                );
            })}
        </>
    );
};

const RowPercentageContainer = styled.div`
    position: relative;
`;

export default Results;
