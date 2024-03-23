import axios from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api/';

const EpisodeRepository = {
  async getEpisodes() {
    try {
      const response = await axios.get(`${BASE_URL}episode`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching episodes:', error);
      throw error;
    }
  },
};

export default EpisodeRepository;