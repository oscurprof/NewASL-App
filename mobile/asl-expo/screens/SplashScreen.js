import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    useEffect(() => {
        // Fade animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        // Check if the user is logged in
        const checkLoginStatus = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken'); // Check token
                if (userToken) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        checkLoginStatus();

        // After 7 seconds, navigate based on the login status
        const timer = setTimeout(() => {
            if (isLoggedIn) {
                navigation.replace('Home'); // Navigate to Home screen if logged in
            } else {
                navigation.replace('Welcome'); // Navigate to Welcome screen if not logged in
            }
        }, 7000); // Splash screen duration of 7 seconds

        return () => clearTimeout(timer);
    }, [navigation, fadeAnim, isLoggedIn]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/logo.jpeg')}
                style={[styles.logo, { opacity: fadeAnim }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});

export default SplashScreen;
