import React, { useMemo } from 'react';
import { FlexDiv } from 'theme/common';
import { Proposal } from 'types/governance';
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

type ResultsProps = {
    proposal: Proposal;
    results: any;
};

const Results: React.FC<ResultsProps> = ({ proposal, results }) => {
    const spaceSymbol = proposal.space.symbol;

    const choices = useMemo(() => {
        const choices = proposal.choices.map((choice: any, i: number) => ({
            choice,
            i,
        }));
        if (results && results.resultsByVoteBalance) {
            return choices.sort(
                (a: any, b: any) => results.resultsByVoteBalance[b.i] - results.resultsByVoteBalance[a.i]
            );
        }
        return choices;
    }, [results, proposal]);

    return (
        <>
            {choices.map((choice: any) => {
                const label = truncateText(choice.choice, 12);
                const percentage = results.sumOfResultsBalance
                    ? results.resultsByVoteBalance[choice.i] / results.sumOfResultsBalance
                    : 0;

                return (
                    <ResultRow key={label}>
                        <SidebarRowData>
                            <FlexDiv>
                                <ResultLabel>{label}</ResultLabel>
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
