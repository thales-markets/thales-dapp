// @ts-ignore
import React from 'react';
import disclaimer from 'assets/docs/thales-protocol-disclaimer.pdf';
import termsOfUse from 'assets/docs/thales-terms-of-use.pdf';
import { DisclaimerComponent } from '@rainbow-me/rainbowkit';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { ScreenSizeBreakpoint } from 'constants/ui';

const WalletDisclaimer: DisclaimerComponent = ({ Text, Link }) => {
    return (
        <Wrapper>
            <Text>
                <Trans
                    i18nKey="common.wallet.disclaimer-info"
                    components={{
                        disclaimer: (
                            <Link href={disclaimer}>
                                <></>
                            </Link>
                        ),
                        terms: (
                            <Link href={termsOfUse}>
                                <></>
                            </Link>
                        ),
                    }}
                />
            </Text>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        margin-top: -15px;
        margin-bottom: -15px;
    }
`;

export default WalletDisclaimer;
