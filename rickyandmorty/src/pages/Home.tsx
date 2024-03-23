import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import EpisodeRepository from '../repositories/EpisodeRepository';
import { Appbar } from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const EPISODES_PER_PAGE = 10;

const HomeView: React.FC = () => {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        try {
            const results = await EpisodeRepository.getEpisodes();
            setEpisodes(results);
            const totalEpisodes = results.length;
            const totalPages = Math.ceil(totalEpisodes / EPISODES_PER_PAGE);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
<Stack.Navigator>
    
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <View style={styles.episodesContainer}>
                        {episodes
                            .slice((currentPage - 1) * EPISODES_PER_PAGE, currentPage * EPISODES_PER_PAGE)
                            .map((episode: any) => (
                                <View style={styles.episodeBox}>
                                    <Text style={styles.episodeName}>{episode.name}</Text>
                                    <Text style={styles.episode}> - {episode.episode}</Text>
                                    <Text style={styles.air_date}>{episode.air_date}</Text>
                                </View>
                            ))}
                    </View>
                    
                    <View style={styles.paginationContainer}>
                        <View style={{ flex: 1 }}>
                            <Button title="Önceki Sayfa" onPress={handlePrevPage} disabled={currentPage === 1} />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.pageInfo}>Sayfa {currentPage} / {totalPages}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button title="Sonraki Sayfa" onPress={handleNextPage} disabled={currentPage === totalPages} />
                        </View>
                    </View>
                </>
            )}
        </View>
        </Stack.Navigator>
        </NavigationContainer>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#008000',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    episodesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    episodeBox: {
        width: "100%",
        height: 100,
        backgroundColor: '#e0e0e0',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
    episodeName: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Gilroy-Bold',
        textAlign: 'center',

    },
    episode: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    air_date: {
        fontSize: 10,
        fontWeight: 'normal',
        position: 'absolute',
        bottom: 5,
        right: 10,

    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    pageInfo: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    episodeInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeView;
