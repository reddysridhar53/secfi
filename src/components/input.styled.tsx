import styled from 'styled-components';

export const Input = styled('input')`
    color: rgba(0, 0, 0, 0.8);
    padding: 0 8px;
    width: 100%;
    height: 40px;
    font-size: 15px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    outline: none;
    ::placeholder {
        color: rgba(0, 0, 0, 0.4);
    }
`;
