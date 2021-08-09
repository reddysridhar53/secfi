import React from 'react';
import { Block as BlockItem } from './block.styled';

type Position = 'v-center' | 'h-center';

interface Props {
    position?: Position;
    children: any;
    flex?: number;
    col?: boolean;
}

const Label: React.FC<Props> = (props: Props) => {
    const {
        position,
        flex,
        col,
    } = props;

    return (
        <BlockItem flex={flex} col={col} position={position}>{props.children}</BlockItem>
    );
};

export default Label;
