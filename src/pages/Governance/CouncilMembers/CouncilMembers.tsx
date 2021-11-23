import React from 'react';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import useCouncilMembersQuery from 'queries/governance/useCouncilMembersQuery';
import { getIsAppReady } from 'redux/modules/app';
// import externalLink from 'remarkable-external-link';

const CouncilMembers: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const councilMembersQuery = useCouncilMembersQuery({ enabled: isAppReady });
    const councilMembers = councilMembersQuery.isSuccess && councilMembersQuery.data ? councilMembersQuery.data : [];

    return (
        <FlexDivColumnCentered>
            <Title>Current council members</Title>
            <Wrapper>
                <Container>
                    {councilMembers.map((member: any) => (
                        <Row key={member.address}>{member.address}</Row>
                    ))}
                </Container>
            </Wrapper>
        </FlexDivColumnCentered>
    );
};

const Title = styled(FlexDivColumnCentered)`
    font-weight: 500;
    font-size: 25px;
    line-height: 48px;
    color: #f6f6fe;
    margin-bottom: 25px;
    text-align: center;
`;

const Wrapper = styled(FlexDivColumn)`
    background: linear-gradient(rgba(202, 145, 220, 0.3), rgba(106, 193, 213, 0.3));
    padding: 1px 0;
`;

const Container = styled(FlexDivColumn)`
    background-color: #04045a;
`;

const Row = styled(FlexDivRow)`
    margin: 20px;
    font-weight: bold;
    font-size: 16px;
    line-height: 36px;
    color: #f6f6fe;
`;

export default CouncilMembers;
