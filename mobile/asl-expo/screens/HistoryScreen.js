import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const HistoryScreen = () => {
    const [history, setHistory] = useState([]);

    const loadHistory = async () => {
        try {
            const userData = await AsyncStorage.getItem('user'); // 'user' should be your key
            if (userData) {
                const user = JSON.parse(userData);
                const q = query(
                    collection(db, 'history'),
                    where('userId', '==', user.uid),
                    orderBy('timestamp', 'desc')
                );
                const snapshot = await getDocs(q);
                const historyData = snapshot.docs.map(doc => doc.data().text);
                setHistory(historyData);
            } else {
                console.log('No user found in AsyncStorage');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load history');
            console.error(error);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <View>
            {/* Blue Header Box */}
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Translation History</Text>
            </View>

            {history.length === 0 ? (
                <Text style={styles.emptyText}>No history available.</Text>
            ) : (
                <FlatList
                    data={history}
                    renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerBox: {
        backgroundColor: '#1e3a8a',
        paddingTop: 100,
        paddingBottom: 30,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    historyItem: {
        paddingVertical: 8,
        fontSize: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingLeft: 30,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    }
});

export default HistoryScreen;
