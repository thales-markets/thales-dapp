// @ts-ignore
import { DisclaimerComponent } from '@rainbow-me/rainbowkit';
import disclaimer from 'assets/docs/overtime-disclaimer.pdf';
import privacyPolicy from 'assets/docs/overtime-privacy-policy.pdf';
import termsOfUse from 'assets/docs/overtime-terms-of-use.pdf';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

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
                        privacyPolicy: (
                            <Link href={privacyPolicy}>
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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: -15px;
        margin-bottom: -15px;
    }
`;

export default WalletDisclaimer;
