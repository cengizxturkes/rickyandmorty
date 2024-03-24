import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import styles from './styles/CharacterStyles.js';
const Character: React.FC<{ route: { params: { characterUrls: string[] } } }> = ({ route }) => {
    const { characterUrls } = route.params;
    const [characterData, setCharacterData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCharacterData = async () => {
            try {
                const characterPromises = characterUrls.map(url => axios.get(url));
                const characterResponses = await Promise.all(characterPromises);
                const characterData = characterResponses.map(response => response.data);
                setCharacterData(characterData);
            } catch (error) {
                console.error('Error fetching character data:', error);
            }
        };

        fetchCharacterData();
    }, [characterUrls]);
    
    const truncateName = (name: string) => {
        return name.length > 10 ? name.substring(0, 100) + '...' : name;
    };

    const renderStatusIcon = (status: string) => {
        switch (status) {
            case 'Alive':
                return <Text style={{ color: 'green' }}>Alive</Text>;
            case 'Dead':
                return <Text style={{ color: 'red' }}>Dead</Text>;
            case 'unknown':
                return <Text style={{ color: 'gray' }}>Unknown</Text>;
            default:
                return null;
        }
    };

    const handleNavigateCharacterDetail = (character: any) => {
        navigation.navigate('CharacterDetail', { character });
    };

    const charactersPerPage = 10;
    const indexOfLastCharacter = currentPage * charactersPerPage;
    const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;

    const filteredCharacters = characterData.filter(character =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentCharacters = filteredCharacters.slice(indexOfFirstCharacter, indexOfLastCharacter);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View >
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search characters..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View style={styles.rowContainer}>
                        {currentCharacters.map((character, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.characterContainer}
                                onPress={() => handleNavigateCharacterDetail(character)}
                            >
                                <View key={index} style={styles.characterContainer}>
                                    <Image source={{ uri: character.image }} style={styles.characterImage} />
                                    <Text style={styles.characterName}>{truncateName(character.name)}</Text>
                                    {renderStatusIcon(character.status)}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    {filteredCharacters.length > charactersPerPage && (
                        <View style={styles.paginationContainer}>
                            <TouchableOpacity
                                onPress={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                disabled={currentPage === 1 || indexOfFirstCharacter === 0}
                            >
                                <Text style={[styles.paginationButton, (currentPage === 1 || indexOfFirstCharacter === 0) && styles.disabledButton]}>Previous</Text>
                            </TouchableOpacity>
                            <Text>{currentPage}/{Math.ceil(filteredCharacters.length / charactersPerPage)}</Text>
                            <TouchableOpacity
                                onPress={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredCharacters.length / charactersPerPage)))}
                                disabled={indexOfLastCharacter >= filteredCharacters.length}
                            >
                                <Text style={[styles.paginationButton, indexOfLastCharacter >= filteredCharacters.length && styles.disabledButton]}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
    
};

export default Character;
