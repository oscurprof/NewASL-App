import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* App Title */}
            <Text style={styles.title}>Sign Speak</Text>

            {/* App Description */}
            <Text style={styles.description}>
                Sign Speak is an innovative app designed to bridge the communication gap between the hearing and deaf communities. It allows users to translate text into sign language and vice versa, making communication more accessible and inclusive.
            </Text>

            {/* Key Features Section */}
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>• Easy-to-use interface</Text>
                <Text style={styles.bullet}>• Real-time sign language detection</Text>
                <Text style={styles.bullet}>• Translation of text to sign language using static images</Text>
                <Text style={styles.bullet}>• Secure login and user authentication</Text>
            </View>

            {/* Sign to Text Section */}
            <Text style={styles.sectionTitle}>Sign to Text</Text>
            <Text style={styles.description}>
                This feature allows the app to detect hand signs in real-time using the device’s camera. The detected signs are converted into text and displayed on the screen, helping users understand sign language better.
            </Text>

            {/* Text to Sign Section */}
            <Text style={styles.sectionTitle}>Text to Sign</Text>
            <Text style={styles.description}>
                In this feature, users can type any text, and the app will display the corresponding sign language images for each letter or word, making it easier to learn and communicate using sign language.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#002d72',
        textAlign: 'center',
        marginTop: 40, // Adjusted to push title slightly down from top
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#002d72',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'justify',
        lineHeight: 24,
        marginBottom: 10,
    },
    bulletContainer: {
        paddingLeft: 10,
    },
    bullet: {
        fontSize: 16,
        color: '#333',
        marginBottom: 6,
    },
});

export default AboutScreen;
