import React from 'react';
import Container from './styled-components/Container';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import { TooltipStyles } from 'constants/ui';

type InputProps = {
    title: string;
    titleColor?: string;
    titleFontSize?: string;
    value: string | number;
    valueChange?: (value: string | number) => void;
    valueType?: string;
    valueEditDisable?: boolean;
    valueColor?: string;
    valueFontSize?: string;
    subValue?: string;
    subValueColor?: string;
    subValueFontSize?: string;
    borderColor?: string;
    displayTooltip?: boolean;
    tooltipText?: string;
};

const Input: React.FC<InputProps> = ({
    title,
    titleColor,
    titleFontSize,
    value,
    valueChange,
    valueType,
    valueEditDisable,
    valueColor,
    valueFontSize,
    subValue,
    subValueColor,
    subValueFontSize,
    borderColor,
    displayTooltip,
    tooltipText,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof valueChange == 'function') {
            valueChange(e.target.value);
        }
    };

    return (
        <CustomTooltip open={displayTooltip} title={tooltipText ? tooltipText : ''}>
            <Container borderColor={borderColor}>
                <Container.Title color={titleColor} fontSize={titleFontSize}>
                    {title}
                </Container.Title>
                <Container.ValueContainer>
                    <Container.ValueContainer.Value
                        color={valueColor}
                        fontSize={valueFontSize}
                        value={value}
                        onChange={handleChange}
                        disabled={valueEditDisable}
                        type={valueType ? valueType : ''}
                        readOnly={typeof handleChange !== 'function'}
                    />
                    <Container.ValueContainer.SubValue color={subValueColor} fontSize={subValueFontSize}>
                        {subValue}
                    </Container.ValueContainer.SubValue>
                </Container.ValueContainer>
            </Container>
        </CustomTooltip>
    );
};

const CustomTooltip = withStyles(() => ({
    tooltip: {
        minWidth: '100%',
        width: '100%',
        margin: '0',
        backgroundColor: TooltipStyles.error.backgroundColor,
        color: TooltipStyles.error.color,
        fontSize: TooltipStyles.error.fontSize,
    },
}))(Tooltip);

export default Input;
