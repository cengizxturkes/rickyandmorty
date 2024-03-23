import React from 'react';
import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';

const MyComponent = () => {
  const [loaded] = useFonts({
    GetSchwifty: require('../../assets/fonts/GetSchwifty-Regular.ttf'),
  });

  if (!loaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text style={{ fontFamily: 'GetSchwifty' }}>Merhaba, özel yazı tipi!</Text>
    </View>
  );
};

export default MyComponent;