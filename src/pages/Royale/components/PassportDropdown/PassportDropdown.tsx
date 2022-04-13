import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Text } from 'theme/common';

type ScoreboardProps = {
    royalePassports: any[];
    selectedRoyalePassport: any;
    setSelectedRoyalePassport: (pasport: any) => void;
};
const PassportDropdown: React.FC<ScoreboardProps> = ({
    royalePassports,
    selectedRoyalePassport,
    setSelectedRoyalePassport,
}) => {
    const { t } = useTranslation();
    const [showPassportDropdown, setShowPassportDropdown] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <span>{t('options.royale.scoreboard.passport-id')}</span>
            <Selector className={royalePassports.length < 2 ? 'disabled' : ''} isOpen={showPassportDropdown}>
                {royalePassports.length === 0 ? (
                    <Text>N/A</Text>
                ) : royalePassports.length === 1 ? (
                    <Text>{parseInt(royalePassports[0].id as any, 16)}</Text>
                ) : (
                    <Text
                        onClick={
                            royalePassports.length > 1
                                ? setShowPassportDropdown.bind(this, !showPassportDropdown)
                                : undefined
                        }
                    >
                        {parseInt(selectedRoyalePassport as any, 16)}
                        <Arrow className="icon icon--arrow-down" />
                    </Text>
                )}

                {showPassportDropdown &&
                    royalePassports
                        .filter((passport) => passport.id !== selectedRoyalePassport)
                        .map((passport: any, key: number) => (
                            <Text
                                onClick={() => {
                                    setSelectedRoyalePassport(passport.id);
                                    setShowPassportDropdown(false);
                                }}
                                key={key}
                            >
                                {parseInt(passport.id as any, 16)}
                            </Text>
                        ))}
            </Selector>
            {showPassportDropdown && <Overlay onClick={() => setShowPassportDropdown(false)} />}
        </div>
    );
};

export default PassportDropdown;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
`;

const Selector = styled.div<{ isOpen: boolean }>`
    position: relative;
    width: 200px;
    height: ${(props) => (props.isOpen ? 'content' : '28px')};
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px !important;
    line-height: 26px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    cursor: pointer;
    z-index: 5;
    background: var(--color-background);
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const Arrow = styled.i`
    font-size: 12px;
    line-height: 8px;
    display: inline-block;
    padding-bottom: 3px;
    margin-left: 20px;
    position: absolute;
    top: 9px;
    right: 19px;
`;
