import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeProvider } from './ThemeContext';

import AboutScreen from './screens/AboutScreen';
import AlphabetScreen from './screens/AlphabetScreen';
import ForgotScreen from './screens/forgotscreen';
import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import NumberScreen from './screens/NumberScreen';
import SignLibraryScreen from './screens/SignLibraryScreen';
import SignToTextScreen from './screens/SignToTextScreen';
import SignupScreen from './screens/SignupScreen';
import SplashScreen from './screens/SplashScreen';
import TextToSignScreen from './screens/TextToSignScreen';

// Ensure Firebase app is initialized once.
import './screens/firebaseConfig';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />

          {/* The repo doesn’t contain a dedicated Welcome screen; keep flow identical by routing Welcome to Login. */}
          <Stack.Screen name="Welcome" component={LoginScreen} />

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="forgotscreen" component={ForgotScreen} />

          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignToText" component={SignToTextScreen} />
          <Stack.Screen name="TextToSign" component={TextToSignScreen} />

          <Stack.Screen name="SignLibrary" component={SignLibraryScreen} />
          <Stack.Screen name="AlphabetSigns" component={AlphabetScreen} />
          <Stack.Screen name="NumberSigns" component={NumberScreen} />

          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
