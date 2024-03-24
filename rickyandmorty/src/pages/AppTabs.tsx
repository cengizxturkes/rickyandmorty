import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeView from './Home';
import FavoritesScreen from './FavoriteScreen';
import Icon from 'react-native-vector-icons/FontAwesome'; // Örnek bir ikon kütüphanesi

const Tab = createBottomTabNavigator();

const AppTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Ana Sayfa"
                component={HomeView}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Favoriler"
                component={FavoritesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="heart" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AppTabs;
