import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../ThemeContext'; // Adjust the path if needed

const HomeScreen = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [themeDialogVisible, setThemeDialogVisible] = useState(false);
    const navigation = useNavigation();
    const auth = getAuth();
    const { isDarkMode, setIsDarkMode, theme } = useContext(ThemeContext);

    // Reset state on screen focus
    useFocusEffect(
        useCallback(() => {
            setMenuVisible(false);
            setThemeDialogVisible(false);
        }, [])
    );

    // Save theme to Firebase
    const saveThemeToFirebase = async (selectedTheme) => {
        const user = auth.currentUser;
        const db = getFirestore();
        if (user) {
            const userRef = doc(db, "users", user.uid);
            try {
                await updateDoc(userRef, { theme: selectedTheme });
                console.log("Theme updated in Firestore:", selectedTheme);
            } catch (error) {
                console.error("Error updating theme in Firestore:", error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="settings-outline" size={28} color="white" style={{ paddingTop: 50 }} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Welcome to Sign Speak</Text>
                <Image source={require('../assets/logo.jpeg')} style={styles.logo} />
            </View>

            {/* Side Menu */}
            <Modal animationType="slide" transparent={true} visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
                <View style={styles.menuContainer}>
                    <View style={[styles.menu, { backgroundColor: theme.backgroundColor }]}>
                        <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeBtn}>
                            <Text style={[styles.closeBtnText, { color: theme.textColor }]}>✖</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuOption} onPress={() => {
                            setMenuVisible(false);
                            navigation.push('History');}}>
                            <Image source={require("../assets/icon/HISTORY.png")} style={styles.menuIcon} />
                            <Text style={[styles.menuText, { color: theme.textColor }]}> View History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuOption} onPress={() => setThemeDialogVisible(true)}>
                            <Image source={require("../assets/icon/theme.png")} style={styles.menuIcon} />
                            <Text style={[styles.menuText, { color: theme.textColor }]}> Theme</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuOption} onPress={() => { setMenuVisible(false); navigation.push('About'); }}>
                            <Image source={require("../assets/icon/app.png")} style={styles.menuIcon} />
                        <Text style={[styles.menuText, { color: theme.textColor }]}> App Info</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuOption} onPress={handleLogout}>
                            <Image source={require("../assets/icon/logout.png")} style={styles.menuIcon} />
                            <Text style={[styles.menuText, { color: theme.textColor }]}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Theme Dialog */}
            <Modal animationType="slide" transparent={true} visible={themeDialogVisible} onRequestClose={() => setThemeDialogVisible(false)}>
                <View style={styles.dialogContainer}>
                    <View style={[styles.dialog, { backgroundColor: theme.backgroundColor }]}>
                        <Text style={[styles.dialogTitle, { color: theme.textColor }]}>Select Theme</Text>

                        <TouchableOpacity style={styles.dialogOption} onPress={() => {
                            setIsDarkMode(false);
                            saveThemeToFirebase("light");
                            setThemeDialogVisible(false);
                        }}>
                            <Text style={styles.dialogOptionText}> Light Theme</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.dialogOption} onPress={() => {
                            setIsDarkMode(true);
                            saveThemeToFirebase("dark");
                            setThemeDialogVisible(false);
                        }}>
                            <Text style={styles.dialogOptionText}> Dark Theme</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setThemeDialogVisible(false)} style={styles.closeDialogBtn}>
                            <Text style={styles.closeDialogText}> Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Main Content with Scroll */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20 }}>
                <View style={styles.mainContent}>
                    <Text style={[styles.selectedOption, { color: theme.textColor }]}>Select Option :</Text>

                    <TouchableOpacity style={styles.option} onPress={() => navigation.push('SignToText')}>
                        <Image source={require('../assets/sign_to_text.jpg')} style={styles.optionImage} />
                        <Text style={styles.optionText}>Sign to Text</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={() => navigation.push('TextToSign')}>
                        <Image source={require('../assets/text_to_sign.jpg')} style={styles.optionImage} />
                        <Text style={styles.optionText}>Text to Sign</Text>
                    </TouchableOpacity>

                    {/* New: Sign Library */}
                    <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("SignLibrary")}>
                        <Image source={require("../assets/sign library.png")} style={styles.optionImage} />
                        <Text style={styles.optionText}>Sign Library</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { backgroundColor: '#002d72', padding: 20, flexDirection: 'row', height: 150, justifyContent: 'space-between', alignItems: 'center' },
    headerText: { fontSize: 20, color: 'white', fontWeight: 'bold', paddingTop: 50 },
    logo: { width: 50, height: 50, resizeMode: 'contain' },
    menuContainer: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' },
    menu: { padding: 20, width: '50%', height: '100%', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 } },
    menuOption: {
            marginVertical: 15,
            flexDirection: "row",   
        }, 
    menuText: { fontSize: 18 },
    closeBtn: { alignSelf: 'flex-end' },
    closeBtnText: { fontSize: 20 },
    dialogContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    dialog: { padding: 20, width: '80%', borderRadius: 10, alignItems: 'center' },
    dialogTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    dialogOption: { padding: 10, marginBottom: 10, backgroundColor: '#002d72', width: '100%', alignItems: 'center', borderRadius: 8 },
    dialogOptionText: { color: 'white', fontSize: 16 },
    closeDialogBtn: { marginTop: 10 },
    closeDialogText: { color: 'red', fontSize: 16 },
    mainContent: { width: '100%', alignItems: 'center' },
    selectedOption: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    option: { backgroundColor: '#002d72', borderRadius: 8, marginBottom: 20, alignItems: 'center', padding: 10, width: '90%' },
    optionImage: { width: '100%', height: 150, borderRadius: 8, resizeMode: 'contain' },
    optionText: { color: 'white', fontSize: 18, marginTop: 10 },
    menuIcon: {         
        width: 20,
        height: 20,
        resizeMode: "contain",
        marginRight: 10,
    },
});

export default HomeScreen;
