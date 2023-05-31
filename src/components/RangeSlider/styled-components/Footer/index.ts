import styled from 'styled-components';

const Footer = styled.div<{ justifyContent?: string }>`
    width: 100%;
    text-align: right;
    ${(props) => (props?.justifyContent ? `justify-content: ${props.justifyContent};` : '')}
    ${(props) => (props?.justifyContent ? `display: flex;` : '')}
    color: var(--notice-text);
    font-size: 14px;
    margin-top: 3px;
    padding: 0px 5px;
`;

export default Footer;
