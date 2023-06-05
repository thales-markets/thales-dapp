import React, { useMemo, useState } from 'react';
import { FlexDiv, FlexDivCentered, FlexDivColumn } from 'styles/common';
import { formatPercentage, formatNumberShort } from 'utils/formatters/number';
import { Percentage, SidebarRowData, Votes, LoaderContainer, ViewMore } from 'pages/Governance/styled-components';
import { truncateText } from 'utils/formatters/string';
import { useTheme } from 'styled-components';
import {
    FIRST_COUNCIL_ELECTIONS_ID,
    NUMBER_OF_COUNCIL_MEMBERS,
    VOTING_ORACLE_COUNCIL_PROPOSAL_ID,
    NUMBER_OF_ORACLE_COUNCIL_MEMBERS,
} from 'constants/governance';
import SimpleLoader from 'components/SimpleLoader';
import { ProposalResults } from 'types/governance';
import { useTranslation } from 'react-i18next';
import Tooltip from 'components/TooltipV2';
import { ThemeInterface } from 'types/ui';
import {
    ResultRow,
    RowPercentage,
    RowPercentageIndicator,
    ResultLabel,
    RowPercentageContainer,
} from './styled-components';

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
    const theme: ThemeInterface = useTheme();
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
                                opacity={isCouncilResults && index >= numberOfCouncilMemebers ? 0.5 : 1}
                                borderColor={
                                    (isCouncilVoting || isCouncilResults) && index === numberOfCouncilMemebers - 1
                                        ? theme.borderColor.primary
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
                                        <Tooltip overlay={choice.choice}>
                                            <ResultLabel>{label}</ResultLabel>
                                        </Tooltip>
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

export default Results;
