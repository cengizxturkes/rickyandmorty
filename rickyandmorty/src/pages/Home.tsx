import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, TextInput, ScrollView } from 'react-native';
import EpisodeRepository from '../repositories/EpisodeRepository';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

interface Episode {
    name: string;
    episode: string;
    air_date: string;
    characters: string[];
}

const EPISODES_PER_PAGE = 10;

const HomeView: React.FC = () => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchData();
    }, [currentPage, searchQuery]);

    const fetchData = async () => {
        try {
            const results = await EpisodeRepository.getEpisodes();
            setEpisodes(results);
            const filteredResults = results.filter(episode =>
                episode.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const totalEpisodes = filteredResults.length;
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

    const handleNavigateToNewCharacter = (characterUrls: string[]) => {
        navigation.navigate('Character', { characterUrls });
    };

    const filteredEpisodes = episodes.filter(episode =>
        episode.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search episodes..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <View style={styles.container}>
                            {filteredEpisodes
                                .slice((currentPage - 1) * EPISODES_PER_PAGE, currentPage * EPISODES_PER_PAGE)
                                .map((episode: Episode, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.episodeBox}
                                        onPress={() => handleNavigateToNewCharacter(episode.characters)}
                                    >
                                        <Text style={styles.episodeName}>{episode.name}</Text>
                                        <Text style={styles.episode}> - {episode.episode}</Text>
                                        <Text style={styles.air_date}>{episode.air_date}</Text>
                                    </TouchableOpacity>
                                ))}
                        </View>

                        {totalPages > 1 && (
                            <View style={styles.paginationContainer}>
                                <View style={{ flex: 1 }}>
                                    <Button
                                        title="Previous Page"
                                        onPress={handlePrevPage}
                                        disabled={currentPage === 1}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={styles.pageInfo}>Page {currentPage} / {totalPages}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Button
                                        title="Next Page"
                                        onPress={handleNextPage}
                                        disabled={currentPage === totalPages}
                                    />
                                </View>
                            </View>
                        )}
                    </>
                )}
            </View>
        </ScrollView>
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
    searchInput: {
        width: '90%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        marginLeft: 20,
        marginRight:20,
        marginTop:20
    },
    episodeBox: {
        width: '100%',
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
    scrollViewContent: {
        flexGrow: 1,
    },
});

export default HomeView;
