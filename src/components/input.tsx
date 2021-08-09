import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Input } from './input.styled';
import Label from './label';

interface Props {
    label?: string;
    placeHolder?: string;
    name: string;
    type: string;
    onChange: (params: string) => void;
    onEnter?: (params: string) => void;
}

const TextInput: React.FC<Props> = (props: Props) => {
    const {
        placeHolder,
        label,
        name,
        onChange: onIputChage,
        type,
        onEnter,
        ...rest
    } = props;
    const [value, setValue] = useState<string>('');

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
        onIputChage(value);
    }

    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.charCode === 13 || event.keyCode === 13) {
            onEnter && onEnter(value);
        }
    }

    return (
        <>
            {
                label && (<Label name={name} label={label} />)
            }
            <Input placeholder={placeHolder} name={name} onChange={onChange} onKeyPress={onKeyPress} value={value} type={type} { ...rest } />
        </>
    )
};

export default TextInput;
