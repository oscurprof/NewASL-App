import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "./constants/Colors";
import { auth } from "./firebaseConfig";
import { Feather } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotScreen() {
    const [email, setEmail] = useState("");

    const handlePassword = async () => {
        await sendPasswordResetEmail(auth, email)
            .then(() => alert("Password reset email sent 🚀"))
            .catch((error) => console.log(error.message));
    };

    return (
        <View style={styles.container}>
            {/* Background color behind image */}
            <View style={styles.imageBackground}>
                <Image
                    source={require("../assets/logo.jpeg")}
                    style={{ width: 300, height: 220 }}
                />
            </View>

            <ScrollView
                style={styles.formContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Centered Text */}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Forgot your password?</Text>
                </View>

                <View style={styles.emailContainer}>
                    <Feather
                        name="mail"
                        size={20}
                        color="blue"
                        style={{ marginLeft: 15 }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email address here"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={false}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={handlePassword}
                >
                    <View>
                        <Text style={styles.send}>Send password reset link</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.spam}>
                    <Text style={{ fontSize: 12, color: "#000", fontWeight: "400" }}>
                        Check your email spam folder to find password reset link
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginHorizontal: 15,
        backgroundColor: '#fff',
        marginTop: "8%",
    },
    imageBackground: {
        marginTop: 55,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#1F3A93", // Login screen header color
        paddingVertical: 20,
        borderRadius: 10,
    },
    textContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    emailContainer: {
        marginTop: 15,
        width: "100%",
        height: 50,
        backgroundColor: Colors.white,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1, // Black border
        borderColor: "black",
    },
    input: {
        flex: 1,
        color: Colors.dark,
        fontSize: 16,
        paddingHorizontal: 7,
    },
    buttonContainer: {
        marginTop: "5%",
        width: "100%",
        height: 50,
        backgroundColor: "#1F3A93", // Login header color
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginBottom: 10,
    },
    send: {
        color: Colors.white,
        fontSize: 18,
    },
    spam: {
        marginTop: 3,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center", // Center align text
    },
    formContainer: {
        width: "100%",
    },
});
