// SignLibraryScreen.js
import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ThemeContext } from "../ThemeContext";

const SignLibraryScreen = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.title, { color: theme.textColor }]}>Sign Library</Text>

            {/* Alphabets */}
            <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate("AlphabetSigns")}
            >
                <Image source={require("../assets/alphabet.png")} style={styles.optionImage} />
                <Text style={styles.optionText}>Alphabets</Text>
            </TouchableOpacity>

            {/* Numericals */}
            <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate("NumberSigns")}
            >
                <Image source={require("../assets/numbers.png")} style={styles.optionImage} />
                <Text style={styles.optionText}>Numbers</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 30,
    },
    optionButton: {
        width: "90%",
        padding: 15,
        backgroundColor: "#002d72",
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    optionImage: {
        width: 80,
        height: 80,
        resizeMode: "contain",
        marginBottom: 10,
    },
    optionText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "600",
    },
});

export default SignLibraryScreen;
