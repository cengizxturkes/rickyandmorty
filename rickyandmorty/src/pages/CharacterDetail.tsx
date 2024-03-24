import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../redux/favoritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '@rneui/themed';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import  styles  from './styles/CharacterDetailStyles.js';
const CharacterDetail: React.FC<{ route: { params: { character: any } } }> = ({ route }) => {
    const { character } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    const dispatch = useDispatch();
    const favorites = useSelector((state: any) => state.favorites) || [];

    useEffect(() => {
        checkIfFavorite();
    }, [favorites]); 

    const checkIfFavorite = async () => {
        if (favorites && favorites.length > 0) {
            setIsFavorite(favorites.some((fav: any) => fav.id === character.id));
        } else {
            setIsFavorite(false);
        }
    };

    const toggleFavorite = async () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(character));
        } else {
            const favoritesLength = favorites.length;
            if (favoritesLength < 10) {
                dispatch(addToFavorites(character));
                setIsFavorite(true);
            } else {
                PushNotificationIOS.addNotificationRequest({
                    id: '1',
                    title: 'Maximum Favori Sayısına Ulaşıldı',
                    body: 'Bu Karakteri Ekleyebilmek için Favoritiesinizden Birini Silmeniz Gerekmektedir. Silmek İster Misiniz?',
                });
                return;
            }
        }
        await updateAsyncStorage();
    
        checkIfFavorite();
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
            <View style={styles.imageContainer}>
                <Image source={{ uri: character.image }} style={styles.characterImage} />
                <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                    <Icon
                        name='heart'
                        type='evilicon'
                        size={50}
                        color={isFavorite ? '#ff0000' : '#517fa4'}
                    />
                </TouchableOpacity>
            </View>
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
        </ScrollView>
    );
};

export default CharacterDetail;
