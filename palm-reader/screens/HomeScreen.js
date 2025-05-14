import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Welcome to Palm Reader</Text>
        <Text style={styles.subtitle}>Your AI-Powered Palm Reading Experience</Text>
        
        <Text style={styles.instructions}>
          To get your palm reading:
          {'\n\n'}1. Take a clear photo of your palm
          {'\n'}2. Our AI will analyze your hand
          {'\n'}3. Receive a detailed reading based on traditional palmistry
        </Text>

        <Text style={styles.note}>
          Note: For the strongest reading, take a picture of your dominant hand.
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Camera')}
          style={styles.button}
          icon="camera"
        >
          Start Reading
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    padding: 20,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 30,
  },
  button: {
    marginTop: 10,
    padding: 8,
  },
}); 