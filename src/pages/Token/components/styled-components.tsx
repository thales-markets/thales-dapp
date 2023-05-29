import styled from 'styled-components';

export const InputContainer = styled.div<{ marginTop?: number; mediaMarginBottom?: number }>`
    display: flex;
    flex-direction: column;
    position: relative;
    ${(props) => (props.marginTop ? 'margin-top: ' + props.marginTop + 'px;' : '')}
    margin-bottom: 20px;
    @media (max-width: 1192px) {
        ${(props) => (props.mediaMarginBottom ? 'margin-bottom: ' + props.mediaMarginBottom + 'px;' : '')}
    }
`;
