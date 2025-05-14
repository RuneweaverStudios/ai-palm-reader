import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, Animated, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Text, ActivityIndicator, Portal, Dialog, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { analyzeHand } from '../services/openaiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PALM_GUIDE_SIZE = Math.min(SCREEN_WIDTH * 0.95, SCREEN_HEIGHT * 0.7);

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [isLeftHand, setIsLeftHand] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isAnalyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanLineAnim.setValue(0);
      setCapturedImage(null);
    }
  }, [isAnalyzing]);

  const storeImage = async (base64Image) => {
    try {
      await AsyncStorage.setItem('tempPalmImage', base64Image);
    } catch (error) {
      console.error('Error storing image:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
        });
        
        setCapturedImage(photo.uri);
        setIsAnalyzing(true);

        await storeImage(photo.base64);
        const result = await analyzeHand(photo.base64);
        navigation.navigate('Result', { reading: result, image: photo.base64 });
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
        setIsAnalyzing(false);
        setCapturedImage(null);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        setIsAnalyzing(true);
        
        await storeImage(result.assets[0].base64);
        const analysis = await analyzeHand(result.assets[0].base64);
        navigation.navigate('Result', { reading: analysis, image: result.assets[0].base64 });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setIsAnalyzing(false);
      setCapturedImage(null);
    }
  };

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.preview} 
            resizeMode="contain"
          />
          <View style={styles.analyzingOverlay}>
            <View style={styles.scanArea}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.analyzingText}>Analyzing your palm...</Text>
              <Text style={styles.analyzingSubText}>This may take a few moments</Text>
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-PALM_GUIDE_SIZE/2, PALM_GUIDE_SIZE/2],
                      }),
                    }],
                  },
                ]}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <CameraView 
            style={StyleSheet.absoluteFill} 
            ref={cameraRef}
            facing="back"
          />
          {/* Camera Overlay */}
          <View style={[styles.overlay, StyleSheet.absoluteFill]} pointerEvents="box-none">
            <View style={styles.palmGuide}>
              <View style={[
                styles.handIconContainer,
                { transform: [{ scaleX: isLeftHand ? -1 : 1 }] }
              ]}>
                <MaterialCommunityIcons 
                  name="hand-front-right-outline" 
                  size={PALM_GUIDE_SIZE * 0.9} 
                  color="rgba(255,255,255,0.5)"
                  style={styles.handIcon}
                />
              </View>
            </View>
            {/* Hand Flip Toggle */}
            <IconButton
              icon={isLeftHand ? "hand-back-left" : "hand-back-right"}
              iconColor="white"
              size={30}
              onPress={() => setIsLeftHand(!isLeftHand)}
              style={styles.flipButton}
            />
          </View>
          {/* Tips Dialog */}
          <Portal>
            <Dialog visible={showTips} onDismiss={() => setShowTips(false)}>
              <Dialog.Title>Tips for Best Results</Dialog.Title>
              <Dialog.Content>
                <Text style={styles.tipText}>• Place your palm within the guide outline</Text>
                <Text style={styles.tipText}>• Ensure good lighting</Text>
                <Text style={styles.tipText}>• Keep your hand flat and steady</Text>
                <Text style={styles.tipText}>• Use the flip button to switch between left and right hand</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowTips(false)}>Got it</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <View style={styles.buttonContainer} pointerEvents="box-none">
            {isAnalyzing ? (
              <View style={styles.analyzingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.analyzingText}>Analyzing your palm...</Text>
              </View>
            ) : (
              <>
                <Button
                  mode="contained"
                  onPress={takePicture}
                  style={styles.button}
                  icon="camera"
                  labelStyle={styles.buttonLabel}
                >
                  Take Photo
                </Button>
                <Button
                  mode="outlined"
                  onPress={pickImage}
                  style={[styles.button, styles.galleryButton]}
                  icon="image"
                  labelStyle={[styles.buttonLabel, styles.galleryButtonLabel]}
                >
                  Choose from Gallery
                </Button>
                <Button
                  mode="text"
                  onPress={() => setShowTips(true)}
                  style={styles.tipsButton}
                  icon="help-circle"
                  labelStyle={styles.buttonLabel}
                >
                  Show Tips
                </Button>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scanArea: {
    width: PALM_GUIDE_SIZE,
    height: PALM_GUIDE_SIZE,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -PALM_GUIDE_SIZE/2 },
      { translateY: -PALM_GUIDE_SIZE/2 }
    ],
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  palmGuide: {
    width: PALM_GUIDE_SIZE,
    height: PALM_GUIDE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handIconContainer: {
    width: PALM_GUIDE_SIZE * 0.9,
    height: PALM_GUIDE_SIZE * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handIcon: {
    strokeWidth: '1px',
  },
  flipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanLine: {
    position: 'absolute',
    width: PALM_GUIDE_SIZE,
    height: 2,
    backgroundColor: 'rgba(255,0,0,0.7)',
    shadowColor: '#ff0000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  button: {
    marginVertical: 5,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
  },
  galleryButton: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
  },
  galleryButtonLabel: {
    color: '#fff',
  },
  tipsButton: {
    backgroundColor: 'transparent',
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  analyzingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  analyzingSubText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
    opacity: 0.8,
  },
  tipText: {
    fontSize: 16,
    marginBottom: 10,
  },
}); 