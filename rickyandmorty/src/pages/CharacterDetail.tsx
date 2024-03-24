import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../redux/favoritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CharacterDetail: React.FC<{ route: { params: { character: any } } }> = ({ route }) => {
    const { character } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    const dispatch = useDispatch();
    const favorites = useSelector((state: any) => state.favorites) || [];

    useEffect( () => {
        checkIfFavorite();
    }
    , []);

    const checkIfFavorite = async () => {
        if (favorites && favorites.length > 0) {
            console.log("girildi");
           await setIsFavorite(favorites.some((fav: any) => fav.id === character.id));
        } else {
            setIsFavorite(false);
        }
    };
    const toggleFavorite = async () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(character));
            AsyncStorage.getItem('favorites')
    .then((storedFavorites) => {
        if (storedFavorites) {
            const parsedFavorites = JSON.parse(storedFavorites);
            console.log(parsedFavorites);
        } else {
            console.log('No favorites stored in AsyncStorage');
        }
    })
    .catch((error) => {
        console.error('Error fetching favorites from AsyncStorage:', error);
    });
        } else {
            dispatch(addToFavorites(character));
            console.log(AsyncStorage.getItem('favorites'));

        }
        setIsFavorite(!isFavorite);
        await updateAsyncStorage();
    };

    const updateAsyncStorage = async () => {
        try {
            let storedFavorites = await AsyncStorage.getItem('favorites');
            let favoritesArray = storedFavorites ? JSON.parse(storedFavorites) : [];

            if (!Array.isArray(favoritesArray)) {
                favoritesArray = [];
            }

            if (isFavorite) {
                favoritesArray = favoritesArray.filter((fav: any) => fav.id !== character.id);
            } else {
                favoritesArray.push(character);
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
        } catch (error) {
            console.error('Error updating AsyncStorage:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: character.image }} style={styles.characterImage} />
            <Text style={styles.characterName}>{character.name}</Text>
            <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>{character.status}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Species:</Text>
                <Text style={styles.detailValue}>{character.species}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Gender:</Text>
                <Text style={styles.detailValue}>{character.gender}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Origin:</Text>
                <Text style={styles.detailValue}>{character.origin.name}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{character.location.name}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={toggleFavorite}>
            <Icon 
                name={isFavorite ? 'heart' : 'heart'} 
                size={30} 
                color={isFavorite ? 'red' : 'black'} 
            />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    characterImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    characterName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailLabel: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    detailValue: {
        fontSize: 16,
    },
    button: {
        marginTop: 20,
    },
});

export default CharacterDetail;
