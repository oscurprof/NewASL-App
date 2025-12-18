import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ThemeContext } from '../ThemeContext';

import a from '../assets/asl_signs/a.jpg';
import b from '../assets/asl_signs/b.jpg';
import c from '../assets/asl_signs/c.jpg';
import d from '../assets/asl_signs/d.jpg';
import e from '../assets/asl_signs/e.jpg';
import f from '../assets/asl_signs/f.jpg';
import g from '../assets/asl_signs/g.jpg';
import h from '../assets/asl_signs/h.jpg';
import i from '../assets/asl_signs/i.jpg';
import j from '../assets/asl_signs/j.jpg';
import k from '../assets/asl_signs/k.jpg';
import l from '../assets/asl_signs/l.jpg';
import m from '../assets/asl_signs/m.jpg';
import n from '../assets/asl_signs/n.jpg';
import o from '../assets/asl_signs/o.jpg';
import p from '../assets/asl_signs/p.jpg';
import q from '../assets/asl_signs/q.jpg';
import r from '../assets/asl_signs/r.jpg';
import s from '../assets/asl_signs/s.jpg';
import t from '../assets/asl_signs/t.jpg';
import u from '../assets/asl_signs/u.jpg';
import v from '../assets/asl_signs/v.jpg';
import w from '../assets/asl_signs/w.jpg';
import x from '../assets/asl_signs/x.jpg';
import y from '../assets/asl_signs/y.jpg';
import z from '../assets/asl_signs/z.jpg';

const TextToSignScreen = () => {
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const { theme } = useContext(ThemeContext);

    const signMap = {
        a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z
    };

    const saveToHistory = async (enteredText) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const historyRef = collection(db, 'history');
                await addDoc(historyRef, {
                    userId: user.uid,
                    text: enteredText,
                    timestamp: serverTimestamp(),
                });
                Alert.alert('Saved!', 'Your text has been saved to history.');
            } else {
                navigation.navigate('LoginScreen');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save text to history');
            console.error(error);
        }
    };

    const handleTextChange = (inputText) => {
        setText(inputText);

        if (inputText.trim() === '') {
            setImageUrls([]);
            return;
        }

        const sentences = inputText.toLowerCase().split('.');
        const allImages = sentences.map(sentence => {
            const words = sentence.trim().split(' ');
            return words.map(word => {
                const wordImages = word
                    .split('')
                    .map(char => signMap[char] || null)
                    .filter(Boolean);
                if (wordImages.length > 0) {
                    wordImages.push('space');
                }
                return wordImages;
            }).flat();
        });

        setImageUrls(allImages);
    };

    const handleSubmit = () => {
        if (text.trim()) {
            saveToHistory(text);
            setText('');
            setImageUrls([]);
        } else {
            Alert.alert('Empty Input', 'Please enter some text.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            {/* Header */}
            <View style={[styles.header]}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerBoxText}>Text to Sign</Text>
                </View>
            </View>

            {/* Text Input */}
            <TextInput
                style={[styles.input, {
                    borderColor: theme.textColor,
                    color: theme.textColor,
                }]}
                placeholder="Enter Text"
                placeholderTextColor={theme.textColor}
                onChangeText={handleTextChange}
                value={text}
            />

            {/* Scrollable image content */}
            <ScrollView style={styles.scrollArea} contentContainerStyle={{ alignItems: 'center' }}>
                <View style={styles.imageContainer}>
                    {imageUrls.map((sentenceImages, sentenceIndex) => (
                        <ScrollView key={sentenceIndex} horizontal style={styles.sentenceRow}>
                            {sentenceImages.map((image, index) =>
                                image === 'space' ? (
                                    <View key={index} style={styles.space} />
                                ) : (
                                    <Image key={index} source={image} style={styles.image} />
                                )
                            )}
                        </ScrollView>
                    ))}
                </View>
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <View style={styles.rowButtons}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setText('');
                            setImageUrls([]);
                        }}
                    >
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: 150,
        backgroundColor: '#1F3A93',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center', 
        alignItems: 'center',     
    },
    headerBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBoxText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        marginTop: 20,
        borderWidth: 1,
        fontStyle: 'italic',
        textAlign: 'left',
        textAlignVertical: 'top',
        borderRadius: 10,
    },
    scrollArea: {
        flex: 1,
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
    },
    sentenceRow: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    image: {
        width: 80,
        height: 100,
        marginRight: 0,
        borderRadius: 10,
    },
    space: {
        width: 50,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1F3A93',
        padding: 10,
        borderRadius: 20,
        width: 120,
        alignItems: 'center',
    },
    submitButton: {
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default TextToSignScreen;
