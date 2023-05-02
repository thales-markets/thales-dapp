import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import { TooltipStyles } from 'constants/ui';
import styled from 'styled-components';

export const Title = styled.div<{ color?: string; fontSize?: string }>`
    font-family: Roboto !important;
    font-weight: 400;
    margin-bottom: 5px;
    text-transform: uppercase;
    color: ${(props) => (props?.color ? props.color : 'var(--input-border-color)')};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '14px')};
`;

export const ValueContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;

export const Value = styled.input<{ color?: string; fontSize?: string }>`
    font-family: Roboto !important;
    font-weight: 600;
    color: ${(props) => (props?.color ? props.color : 'var(--color-white)')};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '20px')};
    background: transparent;
    border: none;
    padding: 0;
    width: 80%;
    &:focus {
        border: none;
        outline: none;
    }
`;

export const SubValue = styled.span<{ color?: string; fontSize?: string }>`
    font-family: Roboto !important;
    font-weight: 600;
    color: ${(props) => (props?.color ? props.color : 'var(--color-white)')};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '20px')};
`;

export const Container = styled.div<{
    borderColor?: string;
    borderStyle?: string;
    disabled?: boolean;
    width?: string;
    margin?: string;
    height?: string;
    padding?: string;
    shadow?: string;
    background?: string;
    zIndex?: number;
}>`
    width: ${(props) => (props?.width ? props.width : '100%')};
    margin: ${(props) => (props?.margin ? props.margin : '')};
    ${(props) => (props?.height ? `height: ${props.height}` : '')};
    display: flex;
    flex-direction: column;
    border: 0.8px solid ${(props) => (props?.borderColor ? props.borderColor : 'var(--card-border-color)')};
    border-style: ${(props) => (props?.borderStyle ? props.borderStyle : 'solid')};
    border-radius: 10px;
    justify-content: center;
    padding: ${(props) => (props?.padding ? props.padding : '5px 10px')};
    box-sizing: border-box;
    margin-bottom: 8px;
    position: relative;
    opacity: ${(props) => (props?.disabled ? '0.5 !important' : '1')};
    ${(props) => (props?.shadow ? `box-shadow: ${props.shadow}` : '')};
    background: ${(props) => (props?.background ? props.background : 'transparent')};
    ${(props) => (props?.zIndex ? `z-index: ${props.zIndex}` : '')};
`;

export const CustomTooltip = withStyles(() => ({
    tooltip: {
        minWidth: '100%',
        width: '100%',
        margin: '0',
        backgroundColor: TooltipStyles.error.backgroundColor,
        color: TooltipStyles.error.color,
        fontSize: TooltipStyles.error.fontSize,
    },
}))(Tooltip);
