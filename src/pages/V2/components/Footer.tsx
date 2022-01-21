import React from 'react';
import styled from 'styled-components';
import footer from 'assets/images/landing-page/footer.png';
import footerW from 'assets/images/landing-page/footer-white.png';
import footer2 from 'assets/images/landing-page/footer_black.svg';
import footerW2 from 'assets/images/landing-page/footer_white.svg';
import { IconLink } from 'theme/common';
import { Theme } from '../Home';

type HeaderInput = {
    theme: Theme;
    className?: string;
};

const Footer: React.FC<HeaderInput> = ({ theme, className }) => {
    return (
        <FooterHtml className={className}>
            <Image src={theme === Theme.Dark ? footerW : footer} />
            <Lines src={theme === Theme.Dark ? footerW2 : footer2} />
            <FooterIconsWrapper>
                <IconLink target="_blank" rel="noreferrer" href="https://github.com/thales-markets">
                    <FooterIcon className="icon-home icon-home--github" />
                </IconLink>
                <IconLink target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                    <FooterIcon className="icon-home icon-home--discord" />
                </IconLink>
                <IconLink target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                    <FooterIcon className="icon-home icon-home--medium" />
                </IconLink>
                <IconLink target="_blank" rel="noreferrer" href="https://twitter.com/ThalesMarket">
                    <FooterIcon className="icon-home icon-home--twitter" />
                </IconLink>

                <IconLink target="_blank" rel="noreferrer" href="https://docs.thales.market/">
                    <FooterIcon className="icon-home icon-home--docs" />
                </IconLink>
            </FooterIconsWrapper>
        </FooterHtml>
    );
};

const FlexDiv = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    color: var(--color);
    flex-wrap: wrap;
`;

const Lines = styled.img`
    position: absolute;
    z-index: 1;
    top: -180px;
    width: 150%;
    left: -25%;
    @media (max-width: 600px) {
        width: 200%;
        left: -50%;
    }
`;

const FooterHtml = styled.div`
    position: relative;
    margin-top: 200px;
    &.article {
        & > img {
            display: none !important;
        }
        & > div {
            position: relative;
            bottom: unset !important;
            padding: 0 2em;
            margin-top: 200px;
            margin-bottom: 60px;
            & > a > i {
                color: var(--color) !important;
            }
        }
    }
`;

const Image = styled.img`
    height: 100%;
    object-fit: contain;
    position: relative;
    top: 20px;
    z-index: 2;
    @media (max-width: 600px) {
        width: 100%;
        transform: scale(1.52);
    }
`;

const FooterIconsWrapper = styled(FlexDiv)`
    position: absolute;
    bottom: 2.4em;
    z-index: 3;
`;
const FooterIcon = styled.i`
    font-size: 3em;
    color: #f7f7f7;
`;

export default Footer;
