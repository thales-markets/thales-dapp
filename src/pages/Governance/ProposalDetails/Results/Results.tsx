import React, { useMemo, useState } from 'react';
import { FlexDiv, FlexDivCentered, FlexDivColumn } from 'theme/common';
import { formatPercentage, formatNumberShort } from 'utils/formatters/number';
import {
    ResultLabel,
    Percentage,
    RowPercentage,
    RowPercentageIndicator,
    ResultRow,
    SidebarRowData,
    Votes,
    LoaderContainer,
    ViewMore,
} from 'pages/Governance/components';
import { truncateText } from 'utils/formatters/string';
import styled from 'styled-components';
import {
    FIRST_COUNCIL_ELECTIONS_ID,
    NUMBER_OF_COUNCIL_MEMBERS,
    VOTING_ORACLE_COUNCIL_PROPOSAL_ID,
    NUMBER_OF_ORACLE_COUNCIL_MEMBERS,
} from 'constants/governance';
import SimpleLoader from 'components/SimpleLoader';
import { ProposalResults } from 'types/governance';
import { useTranslation } from 'react-i18next';
import { LightMediumTooltip } from 'components/OldVersion/old-components';

type ResultsProps = {
    proposalResults?: ProposalResults;
    isCouncilResults?: boolean;
    isCouncilVoting?: boolean;
    isLoading: boolean;
    showAll?: boolean;
    proposalId: string;
};

const Results: React.FC<ResultsProps> = ({
    isCouncilVoting,
    proposalId,
    proposalResults,
    isCouncilResults,
    isLoading,
    showAll,
}) => {
    const { t } = useTranslation();
    const [viewCount, setViewCount] = useState<number>(showAll ? 1000 : 10);
    const spaceSymbol =
        proposalId.toLowerCase() === FIRST_COUNCIL_ELECTIONS_ID.toLowerCase() || !proposalResults
            ? 'WD'
            : proposalResults.spaceSymbol;

    const choices = useMemo(() => {
        if (proposalResults) {
            const choices = proposalResults.choices.map((choice: any, i: number) => ({
                choice,
                i,
            }));
            if (proposalResults.results && proposalResults.results.resultsByVoteBalance) {
                return choices.sort(
                    (a: any, b: any) =>
                        proposalResults.results.resultsByVoteBalance[b.i] -
                        proposalResults.results.resultsByVoteBalance[a.i]
                );
            }
            return choices;
        }
        return [];
    }, [proposalResults]);

    const numberOfCouncilMemebers = isCouncilResults
        ? NUMBER_OF_COUNCIL_MEMBERS
        : proposalId === VOTING_ORACLE_COUNCIL_PROPOSAL_ID
        ? NUMBER_OF_ORACLE_COUNCIL_MEMBERS
        : NUMBER_OF_COUNCIL_MEMBERS;

    return (
        <>
            {!isLoading && proposalResults && (
                <FlexDivColumn>
                    {choices.slice(0, viewCount).map((choice: any, index: number) => {
                        const results = proposalResults.results;
                        const label = truncateText(
                            choice.choice,
                            isCouncilResults && index < numberOfCouncilMemebers ? 18 : 12
                        );
                        const percentage = results.sumOfResultsBalance
                            ? results.resultsByVoteBalance[choice.i] / results.sumOfResultsBalance
                            : 0;

                        return (
                            <ResultRow
                                key={label}
                                backgroundColor={
                                    (isCouncilVoting || isCouncilResults) && index < numberOfCouncilMemebers
                                        ? '#1B1C33'
                                        : ' var(--color-primary)'
                                }
                                opacity={isCouncilResults && index >= numberOfCouncilMemebers ? 0.5 : 1}
                                borderColor={
                                    (isCouncilVoting || isCouncilResults) && index === numberOfCouncilMemebers - 1
                                        ? '#3f1fb4'
                                        : undefined
                                }
                                paddingBottom={
                                    (isCouncilVoting && index === numberOfCouncilMemebers - 1) ||
                                    (isCouncilResults &&
                                        (index === numberOfCouncilMemebers - 1 || index === choices.length - 1))
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
                    {choices.length > viewCount && (
                        <FlexDivCentered>
                            <ViewMore
                                onClick={() => setViewCount(viewCount + 10)}
                                padding={isCouncilResults ? '10px' : '10px 10px 0px 10px'}
                            >
                                {t(`governance.view-more`)}
                            </ViewMore>
                        </FlexDivCentered>
                    )}
                </FlexDivColumn>
            )}
            {isLoading && (
                <LoaderContainer height={200}>
                    <SimpleLoader />
                </LoaderContainer>
            )}
        </>
    );
};

const RowPercentageContainer = styled.div`
    position: relative;
`;

export default Results;
