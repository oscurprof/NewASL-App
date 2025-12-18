import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const alphabetSigns = [
    require("../assets/signs/alphabets/A.png"),
    require("../assets/signs/alphabets/B.png"),
    require("../assets/signs/alphabets/C.png"),
    require("../assets/signs/alphabets/D.png"),
    require("../assets/signs/alphabets/E.png"),
    require("../assets/signs/alphabets/F.png"),
    require("../assets/signs/alphabets/G.png"),
    require("../assets/signs/alphabets/H.png"),
    require("../assets/signs/alphabets/I.png"),
    require("../assets/signs/alphabets/J.png"),
    require("../assets/signs/alphabets/K.png"),
    require("../assets/signs/alphabets/L.png"),
    require("../assets/signs/alphabets/M.png"),
    require("../assets/signs/alphabets/N.png"),
    require("../assets/signs/alphabets/O.png"),
    require("../assets/signs/alphabets/P.png"),
    require("../assets/signs/alphabets/Q.png"),
    require("../assets/signs/alphabets/R.png"),
    require("../assets/signs/alphabets/S.png"),
    require("../assets/signs/alphabets/T.png"),
    require("../assets/signs/alphabets/U.png"),
    require("../assets/signs/alphabets/V.png"),
    require("../assets/signs/alphabets/W.png"),
    require("../assets/signs/alphabets/X.png"),
    require("../assets/signs/alphabets/Y.png"),
    require("../assets/signs/alphabets/Z.png"),
];

const AlphabetScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSign = () => {
        if (currentIndex < alphabetSigns.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSign = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <View style={styles.container}>
            {/* 🔹 Header fixed at top */}
            <View style={styles.header}>
                <Image
                    source={require("../assets/logo.jpeg")} // <- make sure path is correct
                    style={styles.logo}
                />
                <Text style={styles.headerText}>American Sign Language</Text>
            </View>

            {/* 🔹 Image with navigation arrows */}
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={prevSign}>
                        <Text style={styles.arrow}>{"<"}</Text>
                    </TouchableOpacity>

                    <Image source={alphabetSigns[currentIndex]} style={styles.image} />

                    <TouchableOpacity onPress={nextSign}>
                        <Text style={styles.arrow}>{">"}</Text>
                    </TouchableOpacity>
                </View>

                {/* 🔹 Show current alphabet */}
                <Text style={styles.label}>
                    {String.fromCharCode(65 + currentIndex)} {/* 65 = 'A' */}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    // Header style (fixed)
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 50, // for status bar
        paddingBottom: 15,
        backgroundColor: "#f9f9f9",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
        resizeMode: "contain",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },

    // Content style (center aligned)
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        marginHorizontal: 20,
    },
    arrow: {
        fontSize: 30,
        fontWeight: "bold",
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 24,
        fontWeight: "bold",
    },
});
export default AlphabetScreen;