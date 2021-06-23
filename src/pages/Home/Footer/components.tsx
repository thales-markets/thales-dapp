import styled from 'styled-components';
import { FlexDivColumnCentered } from 'theme/common';
import github from 'assets/images/github.svg';
import twitter from 'assets/images/twitter.svg';
import discord from 'assets/images/discord.svg';

export const FooterIcon = styled.div`
    width: 30px;
    height: 30px;
    margin: 60px;
    @media (max-width: 468px) {
        margin: 40px;
    }
    &.github {
        content: url(${github});
    }
    &.twitter {
        content: url(${twitter});
    }
    &.discord {
        content: url(${discord});
    }
`;

export const PoweredBy = styled.div`
    align-self: start;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
    white-space: nowrap;
    margin: 60px auto;
    @media (max-width: 468px) {
        font-size: 9px;
        line-height: 13px;
    }
`;

export const SyntetixLogo = styled.img`
    width: 220px;
    height: 16px;
    position: relative;
    top: 2px;
    @media (max-width: 468px) {
        width: 160px;
        top: 4px;
        margin-left: 6px;
    }
`;

export const VerticalWrapper = styled(FlexDivColumnCentered)`
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
`;
