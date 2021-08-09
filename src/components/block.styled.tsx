import styled, { css } from 'styled-components';

export const Block = styled<any>('div')`
    display: flex;
    flex: ${(props) => props.flex || 'none'};
    ${({ col }) => col && css`flex-direction: column;`}
    ${({ position }) => position === 'center' && css`align-items: center;
    justify-content: cennter;`}
`;
