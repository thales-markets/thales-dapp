import React from 'react';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { FlexDivColumn } from 'styles/common';

type ProfileSectionProps = {
    title: string;
    subtitle?: string;
    maxHeight?: string;
    mobileMaxHeight?: string;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, subtitle, children, maxHeight, mobileMaxHeight }) => {
    return (
        <Section>
            <SectionHeader>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </SectionHeader>
            <SectionContent maxHeight={maxHeight} mobileMaxHeight={mobileMaxHeight}>
                {children}
            </SectionContent>
        </Section>
    );
};

const Section = styled.div`
    width: 100%;
    justify-content: space-between;
    border-radius: 15px;
    position: relative;
    margin-bottom: 15px;
`;

const SectionHeader = styled(FlexDivColumn)`
    font-weight: 700;
    font-size: 21px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.primary};
    padding: 10px 0px 20px 0px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px 0px 10px 0px;
        font-size: 18px;
        line-height: 18px;
    }
`;

const Title = styled.p``;

const Subtitle = styled.p`
    padding-top: 5px;
    font-weight: 400;
    font-size: 15px;
    line-height: 16px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
        line-height: 15px;
    }
`;

const SectionContent = styled.div<{ maxHeight?: string; mobileMaxHeight?: string }>`
    color: ${(props) => props.theme.textColor.primary};
    overflow-y: auto;
    padding-right: 4px;
    max-height: ${(props) => props.maxHeight || '320px'};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-height: ${(props) => props.mobileMaxHeight || '345px'};
    }
    &::-webkit-scrollbar {
        width: 5px;
    }
`;

export default ProfileSection;
