import styled from 'styled-components';

export const PageLayoutStyled = styled('div')`
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-areas:
        'auto header'
        'auto main';
    grid-template-rows: max-content auto;
    grid-template-columns: auto 1fr;

    & > header {
        grid-area: header;
    }

    & > main {
        grid-area: main;
        transition: width 200ms;
    }
`;
