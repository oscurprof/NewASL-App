import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import { auth, db } from "./firebaseConfig"; // Import Firestore from firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import createUserWithEmailAndPassword
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods

const { width, height } = Dimensions.get("window");

export default function SignupScreen() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [fullNameError, setFullNameError] = useState("");

    const validateEmail = (text) => {
        setEmail(text);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = (text) => {
        setPassword(text);
        if (text.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
        } else if (!/[A-Z]/.test(text)) {
            setPasswordError("Password must contain at least one uppercase letter");
        } else if (!/[a-z]/.test(text)) {
            setPasswordError("Password must contain at least one lowercase letter");
        } else if (!/[0-9]/.test(text)) {
            setPasswordError("Password must contain at least one number");
        } else {
            setPasswordError("");
        }
    };

    const validateConfirmPassword = (text) => {
        setConfirmPassword(text);
        if (text !== password) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    const validateFullName = (text) => {
        setFullName(text);
        if (text.length < 3) {
            setFullNameError("Full name must be at least 3 characters long");
        } else {
            setFullNameError("");
        }
    };

    const handleSignup = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required");
            return;
        }
        if (emailError || passwordError || fullNameError || confirmPasswordError) {
            Alert.alert("Error", "Please fix the errors before submitting");
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store the user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: fullName,
                email: email,
                uid: user.uid,
                // You should not store password in Firestore, as Firebase Authentication handles password security
            });

            Alert.alert("Success", "You have successfully signed up!", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("Login"), // Navigate to login screen
                },
            ]);
        } catch (error) {
            Alert.alert("Signup Failed", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Sign Up</Text>
            </View>

            <Text style={styles.title}>Create An Account</Text>

            <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    value={fullName}
                    onChangeText={validateFullName}
                />
            </View>
            {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}

            <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={validateEmail}
                    keyboardType="email-address"
                />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry
                />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={validateConfirmPassword}
                    secureTextEntry
                />
            </View>
            {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.05,
        alignItems: "center",
        paddingTop: height * 0.05,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#234273",
        width: "100%",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingVertical: height * 0.09,
        paddingHorizontal: width * 0.05,
        justifyContent: "center",
    },
    headerText: {
        color: "white",
        fontSize: width * 0.08,
        fontWeight: "bold",
        textAlign: "center",
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: "bold",
        marginTop: height * 0.03,
        color: "#000",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginTop: height * 0.02,
        paddingHorizontal: width * 0.03,
        width: "90%",
    },
    input: {
        flex: 1,
        height: height * 0.06,
        fontSize: width * 0.04,
    },
    errorText: {
        color: "red",
        marginTop: 5,
        fontSize: width * 0.04,
        width: "90%",
    },
    signupButton: {
        backgroundColor: "#234273",
        borderRadius: 20,
        marginTop: height * 0.05,
        paddingVertical: height * 0.02,
        width: "60%",
        alignItems: "center",
    },
    signupButtonText: {
        color: "white",
        fontSize: width * 0.05,
        fontWeight: "bold",
    },
});
