import Button from 'components/ButtonV2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';

type ReadMoreButton = {
    active: boolean;
    onClick: () => void;
};

const ReadMoreButton: React.FC<ReadMoreButton> = ({ active, onClick }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    return (
        <Wrapper>
            <Button
                additionalStyles={{ zIndex: 1 }}
                onClick={onClick}
                fontSize="13px"
                height="26px"
                padding="0px 15px"
                backgroundColor={theme.button.background.quaternary}
            >
                {active ? t('common.show-less') : t('common.read-more')}
            </Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    ::before {
        content: '';
        position: absolute;
        top: 50%;
        z-index: 0;
        left: 0;
        border-top: 1px solid ${(props) => props.theme.borderColor.primary};
        background: black;
        width: 100%;
        transform: translateY(-50%);
    }
`;

export default ReadMoreButton;
