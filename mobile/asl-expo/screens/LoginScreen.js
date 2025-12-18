import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, Dimensions, ScrollView, ActivityIndicator
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage'; //  Add this
import app from "./firebaseConfig";
import { useNavigation } from '@react-navigation/native';

const auth = getAuth(app);

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    });

    //  Updated Firebase Login Function with token storage
    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            const token = await user.getIdToken(); //  Get Firebase ID token

            //  Store token in AsyncStorage
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userEmail', user.email); // (optional)

            setLoading(false);
            Alert.alert("Login Successful", "Welcome to SignSpeak", [
                { text: "OK", onPress: () => navigation.navigate("Home") },
            ]);

        } catch (error) {
            setLoading(false);
            Alert.alert("Login Failed", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}><Text style={styles.headerText}>Login</Text></View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>

            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWithIcon}>
                                <Icon name="email" size={24} color="black" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    value={values.email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWithIcon}>
                                <Icon name="lock" size={24} color="black" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    secureTextEntry
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    value={values.password}
                                />
                            </View>
                            {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity onPress={() => navigation.navigate("forgotscreen")}>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity onPress={handleSubmit} style={styles.loginButton} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Login</Text>}
                        </TouchableOpacity>
                    </>
                )}
            </Formik>

            {/* Sign Up Link */}
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: "#fff", paddingHorizontal: width * 0.05, paddingTop: height * 0.05 },
    header: { flexDirection: "row", alignItems: "center", backgroundColor: "#234273", width: "100%", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingVertical: height * 0.09, justifyContent: "center" },
    headerText: { color: "white", fontSize: width * 0.08, fontWeight: "bold", textAlign: "center" },
    welcomeText: { fontSize: width * 0.06, fontWeight: "bold", marginVertical: height * 0.02, color: "#000", textAlign: "center" },
    inputContainer: { marginBottom: 15, width: "90%", alignSelf: "center" },
    inputWithIcon: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16 },
    errorText: { color: "red", fontSize: 14, marginTop: 5 },
    forgotPassword: { color: "#DC2626", textAlign: "right", marginVertical: 10, fontSize: 14 },
    loginButton: { backgroundColor: "#234273", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
    loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    signupLink: { color: "#234273", textAlign: "center", marginTop: 20, fontSize: 14, fontWeight: "bold" },
});

export default LoginScreen;