import React, { useEffect, useState } from 'react';
import {
    Container,
    OptionTitleContainer,
    Title,
    Option,
    OptionsContainer,
    OptionSubValueContainer,
    Value,
    ValueContainer,
    Arrow,
} from './styled-components';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import OutsideClickHandler from 'react-outside-click-handler';

type SelectProps = {
    title?: string;
    optionsArray: Array<{ index: number; title: string; subValue?: any }>;
    onChangeOption: (index: number) => void;
    selectedOption: number;
};

const Select: React.FC<SelectProps> = ({ title, optionsArray, onChangeOption, selectedOption }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsOpen(false);
    }, [selectedOption]);

    return (
        <Container onClick={() => setIsOpen(true)}>
            <Title>{title}</Title>
            <ValueContainer>
                <Value>{optionsArray[selectedOption]?.title}</Value>
                <Arrow color={'var(--table-header-text-color)'} onClick={() => setIsOpen(true)} />
            </ValueContainer>
            <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
                {isOpen && (
                    <OptionsContainer>
                        {optionsArray?.length &&
                            optionsArray.map((item, key) => (
                                <Option key={key} onClick={() => onChangeOption(item.index)}>
                                    <OptionTitleContainer>
                                        <CurrencyIcon
                                            synthIconStyle={{
                                                marginRight: '0px !important',
                                                paddingRight: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                            currencyKey={item?.title}
                                            width={'50px'}
                                            height={'50px'}
                                        />
                                        {item.title}
                                    </OptionTitleContainer>
                                    {item?.subValue && (
                                        <OptionSubValueContainer>{item?.subValue}</OptionSubValueContainer>
                                    )}
                                </Option>
                            ))}
                    </OptionsContainer>
                )}
            </OutsideClickHandler>
        </Container>
    );
};

export default Select;
