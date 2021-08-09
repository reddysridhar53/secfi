import React from 'react';
import { Label as LabelItem } from './label.styled';

interface Props {
    label: string;
    name: string;
}

const Label: React.FC<Props> = (props: Props) => {
    const {
        label,
        name,
    } = props;

    return (
        <LabelItem htmlFor={name}>{label}</LabelItem>
    );
};

export default Label;
