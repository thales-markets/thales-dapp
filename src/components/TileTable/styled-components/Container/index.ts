import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    margin-left: 40px;
    > * {
        &:before {
            content: '';
            position: absolute;
            opacity: 0.5;
            box-sizing: border-box;
            left: -30px;
            top: 50%;
            transform: translateY(-50%);
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #64d9fe;
            border: 4px solid var(--background);
            box-shadow: 0 0 0 3px #64d9fe;
        }
        &:not(:first-child):after {
            content: '';
            position: absolute;
            opacity: 0.5;
            box-sizing: border-box;
            left: -24px;
            top: -31px;
            width: 2px;
            height: 43px;
            background: #64d9fe;
        }
    }
`;

export default Container;
