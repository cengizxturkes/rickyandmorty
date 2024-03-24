import React, { useState } from 'react';
import { TextInput } from 'react-native';

const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
    const [text, setText] = useState('');

    const handleChangeText = (newText: string) => {
        setText(newText);
        onSearch(newText); 
    };

    return (
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
            placeholder="Search..."
            onChangeText={handleChangeText}
            value={text}
        />
    );
};

export default Search;