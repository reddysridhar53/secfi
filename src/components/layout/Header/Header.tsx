import { Avatar } from '@medly-components/core';
import { WithStyle } from '@medly-components/utils';
import React from 'react';
import * as Styled from './Header.styled';
import Logo from './Logo';

export const Header: React.SFC & WithStyle = () => {
    return (
        <Styled.Header>
            <Styled.LeftSide>
                <Logo 
                    height={36}
                />
            </Styled.LeftSide>
            <Styled.RightSide>
                <Avatar size="M">Sri</Avatar>
            </Styled.RightSide>
        </Styled.Header>
    );
};

Header.displayName = 'Header';
Header.Style = Styled.Header;

export default Header;
