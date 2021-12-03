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
import { COUNCIL_PROPOSAL_ID, NUMBER_OF_COUNCIL_MEMBERS } from 'constants/governance';
import { LightMediumTooltip } from 'pages/Options/Market/components';
import SimpleLoader from 'components/SimpleLoader';
import { ProposalResults } from 'types/governance';
import { useTranslation } from 'react-i18next';

type ResultsProps = {
    proposalResults?: ProposalResults;
    isCouncilResults?: boolean;
    isLoading: boolean;
    showAll?: boolean;
    proposalId: string;
};

const Results: React.FC<ResultsProps> = ({ proposalId, proposalResults, isCouncilResults, isLoading, showAll }) => {
    const { t } = useTranslation();
    const [viewCount, setViewCount] = useState<number>(showAll ? 1000 : 10);
    const spaceSymbol =
        proposalId.toLowerCase() === COUNCIL_PROPOSAL_ID.toLowerCase() || !proposalResults
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

    return (
        <>
            {!isLoading && proposalResults && (
                <FlexDivColumn>
                    {choices.slice(0, viewCount).map((choice: any, index: number) => {
                        const results = proposalResults.results;
                        const label = truncateText(
                            choice.choice,
                            isCouncilResults && index < NUMBER_OF_COUNCIL_MEMBERS ? 18 : 12
                        );
                        const percentage = results.sumOfResultsBalance
                            ? results.resultsByVoteBalance[choice.i] / results.sumOfResultsBalance
                            : 0;

                        return (
                            <ResultRow
                                key={label}
                                backgroundColor={
                                    isCouncilResults && index < NUMBER_OF_COUNCIL_MEMBERS ? '#03044e' : '#04045a'
                                }
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
