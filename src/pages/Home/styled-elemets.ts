import styled, { css } from 'styled-components';

export const Header = styled<any>('h1')`
    margin: 0;
    ${({ main }) =>
        main &&
        css`
            font-weight: bold;
        `}
`;
