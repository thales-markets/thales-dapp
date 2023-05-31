import TextInput from 'components/fields/TextInput';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';

type SearchInputProps = {
    placeholder?: string;
    text: string;
    handleChange: (event: any) => void;
    width?: string;
    height?: string;
    iconTop?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, text, handleChange, width, height, iconTop }) => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <TextInput
                placeholder={`${placeholder || t('common.search-placeholder')}`}
                value={text}
                onChange={(event: any) => handleChange(event.target.value)}
                width={width}
                height={height}
                margin={'0px'}
                inputPadding={'5px 30px 5px 10px;'}
            />
            <Icon className="icon icon--search" iconTop={iconTop} />
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivCentered)`
    position: relative;
    height: fit-content;
`;

const Icon = styled.i<{ iconTop?: string }>`
    font-size: 15px;
    color: ${(props) => props.theme.borderColor.secondary};
    position: absolute;
    right: 8px;
    top: ${(props) => props.iconTop || '8px'};
`;

export default SearchInput;
