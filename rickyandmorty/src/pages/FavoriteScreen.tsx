import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Search from '../components/Search';
import styles from './styles/FavoriteStyles';
const FavoritesScreen: React.FC = () => {
    const navigation = useNavigation();

    const [favorites, setFavorites] = useState<any[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('favorites')
            .then((storedFavorites) => {
                if (storedFavorites) {
                    const parsedFavorites = JSON.parse(storedFavorites);
                    setFavorites(parsedFavorites);
                } else {
                    console.log('No favorites stored in AsyncStorage');
                }
            })
            .catch((error) => {
                console.error('Error fetching favorites from AsyncStorage:', error);
            });
    }, []);

    const checkIfFavorite = async (character: any) => {
        if (favorites && favorites.length > 0) {
            console.log("girildi");
            await setIsFavorite(favorites.some((fav: any) => fav.id === character.id));
        } else {
            setIsFavorite(false);
        }
    };

    const handleNavigateCharacterDetail = (character: any) => {
        navigation.navigate('CharacterDetail', { character });
    };

    const removeFromFavorites = async (character: any) => {
        Alert.alert(
            'Delete ',
            `Are you sure you want to delete ${character.name} from favorites?`,
            [
                {
                    text: 'Back',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedFavorites = favorites.filter((fav: any) => fav.id !== character.id);
                        setFavorites(updatedFavorites);
                        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                    },
                },
            ],
            { cancelable: false }
        );
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFavorites, setFilteredFavorites] = useState<any[]>([]);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filteredFavorites = favorites.filter((character) =>
            character.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log('Filtered Favorites:', filteredFavorites); 
        setFilteredFavorites(filteredFavorites);
    };
    return (
        <View style={styles.container}>
            {favorites.length === 0 ? (
                <View>
                    <Text style={styles.noFavorites}>There is no Favorities Character</Text>
                    <LottieView
                        source={require("../../assets/nofile.json")}
                        autoPlay
                        loop
                        style={{ width: 200, height: 200, alignSelf: 'center' }}
                    />
                </View> 
            ) : (
                <ScrollView style={styles.scrollView}>
                    <Search onSearch={handleSearch} />
                    {(searchQuery === '' ? favorites : filteredFavorites).map((character: any, index: number) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleNavigateCharacterDetail(character)}
                            onLongPress={() => removeFromFavorites(character)}
                        >
                            <View style={styles.characterItem}>
                                <Image
                                    source={{ uri: character.image }}
                                    style={styles.characterImage}
                                />
                                <Text style={styles.characterName}>{character.name}</Text>
                
                                <Icon
                                    name="heart"
                                    size={20}
                                    color="red"
                                    style={{ marginLeft: 'auto' }}  
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
    
};

export default FavoritesScreen;
