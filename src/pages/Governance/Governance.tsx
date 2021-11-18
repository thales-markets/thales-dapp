import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { useLocation } from 'react-router-dom';
import { history } from 'utils/routes';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { isNetworkSupported } from 'utils/network';
import MarketHeader from 'pages/Options/Home/MarketHeader';
import Loader from 'components/Loader';
import { Background, FlexDivCentered, FlexDivColumn, FlexDiv } from 'theme/common';
import { SpaceKey } from 'constants/governance';
import ProposalList from './ProposalList';
import ProposalDetails from './ProposalDetails';
import { Proposal } from 'types/governance';
import CouncilMembers from './CouncilMembers';

const GovernancePage: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>(undefined);

    const location = useLocation();
    const paramTab = queryString.parse(location.search).tab;
    const [selectedTab, setSelectedTab] = useState(paramTab ?? 'tips');

    const optionsTabContent: Array<{
        id: string;
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'tips',
                name: 'TIPS',
            },
            {
                id: 'council',
                name: 'Council',
            },
        ],
        [t]
    );

    return (
        <Background style={{ minHeight: '100vh' }}>
            {networkId && isNetworkSupported(networkId) ? (
                <>
                    <Container>
                        <FlexDivColumn style={{ width: '100%' }} className="earn">
                            <MarketHeader route={ROUTES.Governance} />
                        </FlexDivColumn>
                    </Container>
                    <Container>
                        <FlexDivColumn>
                            <Title style={{ alignSelf: 'flex-start' }}>Governance</Title>
                            <FlexDiv>
                                <MainContentContainer>
                                    <OptionsTabContainer>
                                        {optionsTabContent.map((tab, index) => (
                                            <OptionsTab
                                                isActive={tab.id === selectedTab}
                                                key={index}
                                                index={index}
                                                onClick={() => {
                                                    history.push({
                                                        pathname: location.pathname,
                                                        search: queryString.stringify({
                                                            tab: tab.id,
                                                        }),
                                                    });
                                                    setSelectedTab(tab.id);
                                                }}
                                                className={`${tab.id === selectedTab ? 'selected' : ''}`}
                                            >
                                                {tab.name}
                                            </OptionsTab>
                                        ))}
                                    </OptionsTabContainer>
                                    {selectedTab === 'tips' && (
                                        <ProposalList
                                            spaceKey={SpaceKey.TIPS}
                                            setSelectedProposal={setSelectedProposal}
                                        />
                                    )}
                                    {selectedTab === 'council' && (
                                        <ProposalList
                                            spaceKey={SpaceKey.COUNCIL}
                                            setSelectedProposal={setSelectedProposal}
                                        />
                                    )}
                                </MainContentContainer>
                                <SidebarContainer>
                                    {selectedProposal && <ProposalDetails proposal={selectedProposal} />}
                                    {!selectedProposal && <CouncilMembers />}
                                </SidebarContainer>
                            </FlexDiv>
                        </FlexDivColumn>
                    </Container>
                </>
            ) : (
                <Loader />
            )}
        </Background>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    padding-left: 120px;
    padding-right: 30px;
    @media (max-width: 1024px) {
        flex-direction: column;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
    }
`;

const MainContentContainer = styled.div`
    width: 808px;
    background: #04045a;
    border: 2px solid rgba(202, 145, 220, 0.2);
    border-radius: 5px;
    padding: 25px 30px;
`;

const SidebarContainer = styled.div`
    background: #04045a;
    border: 2px solid rgba(202, 145, 220, 0.2);
    border-radius: 5px;
    padding: 35px 0px;
    width: 470px;
    margin-left: 10px;
`;

const OptionsTabContainer = styled(FlexDiv)`
    height: 40px;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 48px;
    color: #748bc6;
    user-select: none;
    border-bottom: 5px solid #04045a;
    margin-left: 25px;
    margin-right: 25px;
    &.selected {
        transition: 0.2s;
        color: #f6f6fe;
        border-bottom: 5px solid #64d9fe;
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: #00f9ff;
    }
`;

const Title = styled.p`
    font-weight: bold;
    line-height: 64px;
    letter-spacing: -1px;
    font-size: 39px;
    padding-bottom: 65px;
    color: #f6f6fe;
    @media (max-width: 1024px) {
        font-size: 31px;
        padding-top: 30px;
        padding-bottom: 0;
    }
`;

export default GovernancePage;
