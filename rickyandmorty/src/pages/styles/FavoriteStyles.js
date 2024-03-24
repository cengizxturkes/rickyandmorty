import {StyleSheet} from 'react-native';
const Favoritestyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  noFavorites: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 50,
    textDecorationColor: 'gray',
    color: 'gray',
  },
  characterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  characterName: {
    fontSize: 16,
  },
});
export default Favoritestyles;
