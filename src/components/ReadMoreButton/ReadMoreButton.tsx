import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type ReadMoreButton = {
    active: boolean;
    onClick: () => void;
};

const ReadMoreButton: React.FC<ReadMoreButton> = ({ active, onClick }) => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Button
                additionalStyles={{ zIndex: 1 }}
                padding={'5px 10px'}
                active={true}
                hoverShadow={'var(--button-shadow)'}
                onClickHandler={onClick}
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
        border-top: 1px solid var(--color-secondary);
        background: black;
        width: 100%;
        transform: translateY(-50%);
    }
`;

export default ReadMoreButton;
