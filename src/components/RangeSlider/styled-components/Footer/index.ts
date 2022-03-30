import styled from 'styled-components';

const Footer = styled.div<{ justifyContent?: string }>`
    width: 100%;
    text-align: right;
    ${(_props) => (_props?.justifyContent ? `justify-content: ${_props.justifyContent};` : '')}
    ${(_props) => (_props?.justifyContent ? `display: flex;` : '')}
    color: var(--notice-text);
    font-size: 14px;
    font-family: Roboto !important;
    margin-top: 3px;
    padding: 0px 5px;
`;

export default Footer;
