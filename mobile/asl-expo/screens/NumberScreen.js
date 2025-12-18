import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
const numberSigns = [
    require("../assets/signs/numbers/0.png"),
    require("../assets/signs/numbers/1.png"),
    require("../assets/signs/numbers/2.png"),
    require("../assets/signs/numbers/3.png"),
    require("../assets/signs/numbers/4.png"),
    require("../assets/signs/numbers/5.png"),
    require("../assets/signs/numbers/6.png"),
    require("../assets/signs/numbers/7.png"),
    require("../assets/signs/numbers/8.png"),
    require("../assets/signs/numbers/9.png"),
];
const NumberScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSign = () => {
        if (currentIndex < numberSigns.length - 1) {
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
            <View style={styles.header}>
                <Image
                    source={require("../assets/logo.jpeg")}  
                    style={styles.logo}
                />
                <Text style={styles.headerText}>American Sign Language</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={prevSign}>
                        <Text style={styles.arrow}>{"<"}</Text>
                    </TouchableOpacity>

                    <Image source={numberSigns[currentIndex]} style={styles.image} />

                    <TouchableOpacity onPress={nextSign}>
                        <Text style={styles.arrow}>{">"}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>{currentIndex}</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 50, 
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
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    image: { width: 150, height: 150, resizeMode: "contain", marginHorizontal: 20 },
    arrow: { fontSize: 30, fontWeight: "bold", paddingHorizontal: 20 },
    label: { fontSize: 24, fontWeight: "bold" },
});
export default NumberScreen;