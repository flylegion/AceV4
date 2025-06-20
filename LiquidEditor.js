import { useAceKeyboardAutoScroll } from './Ace';
import { AceHTML, onMessage } from './Ace';
import { WebView } from 'react-native-webview';
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BlurView } from 'expo-blur';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const panelHeight = screenHeight * 0.25;

export default function LiquidEditor() {
  const [treeVisible, setTreeVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const treeAnim = useRef(new Animated.Value(-screenWidth * 0.5)).current;
  const logAnim = useRef(new Animated.Value(screenHeight + panelHeight + 32)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleTree = () => {
    const willShow = !treeVisible;
    Animated.timing(treeAnim, {
      toValue: willShow ? 0 : -screenWidth * 0.5,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(overlayOpacity, {
      toValue: willShow || logVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setTreeVisible(willShow);
  };

  const toggleLog = () => {
    const willShow = !logVisible;
    Animated.timing(logAnim, {
      toValue: willShow
        ? screenHeight - panelHeight - 32
        : screenHeight + panelHeight + 32,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(overlayOpacity, {
      toValue: willShow || treeVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setLogVisible(willShow);
  };

  const handleCopy = (text) => {
    Clipboard.setStringAsync(text);
  };

  const alertMessages = Array.from({ length: 25 }, (_, i) => `🔔 Alert ${i + 1}: This is an example of a very long log message that might not fit in a single line but should be copyable in full.`);

  const webViewRef = useRef(null);
  useAceKeyboardAutoScroll(webViewRef);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton}>
          <Text style={styles.icon}>⌂</Text>
        </TouchableOpacity>

        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={toggleTree}>
            <Text style={styles.saveButtonText}>File</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topButton}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cuerpo principal */}
      <View style={styles.mainArea}>
        <View style={styles.editorHost}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: AceHTML }}
            style={StyleSheet.absoluteFill}
            javaScriptEnabled
            onMessage={onMessage}
          />
        </View>

        {/* Barras negras por encima del editor, pero debajo del resto */}
        <View style={styles.coverTop} />
        <View style={styles.coverBottom} />
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveButton} onPress={toggleLog}>
          <Text style={styles.saveButtonText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Paste</Text>
        </TouchableOpacity>
      </View>

      {/* Overlay con blur */}
      {(treeVisible || logVisible) && (
        <TouchableWithoutFeedback
          onPress={() => {
            if (treeVisible) toggleTree();
            if (logVisible) toggleLog();
          }}
        >
          <Animated.View style={[styles.overlayDismiss, { opacity: overlayOpacity }]}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          </Animated.View>
        </TouchableWithoutFeedback>
      )}

      {/* Árbol lateral animado */}
      <Animated.View
        style={[
          styles.projectTreePanel,
          {
            transform: [{ translateX: treeAnim }],
            top: screenHeight * 0.13,
            height: screenHeight * 0.837,
            width: screenWidth * 0.5,
          },
        ]}
      />

      {/* Panel de alertas animado */}
      <Animated.View
        style={[
          styles.alertPanel,
          {
            transform: [{ translateY: logAnim }],
            height: panelHeight,
          },
        ]}
      >
        <ScrollView bounces={false}>
          {alertMessages.map((msg, index) => (
            <View key={index} style={styles.alertRow}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.alertText}
              >
                {msg}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopy(msg)}
              >
                <Text style={styles.copyIcon}>⧉</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    position: 'relative',
  },
  coverTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#000',
    zIndex: 1,
  },
  coverBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#000',
    zIndex: 1,
  },
  topBar: {
    position: 'absolute',
    top: '5%',
    left: 16,
    right: 16,
    height: 55,
    backgroundColor: '#222',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  topButton: {
    padding: 6,
    marginLeft: 8,
  },
  icon: {
    fontSize: 18,
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 15,
    height: 35,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
  },
  editorHost: {
    flex: 1,
    backgroundColor: '#000',
    zIndex: 0,
  },
  bottomBar: {
    position: 'absolute',
    bottom: '5%',
    left: 16,
    right: 16,
    height: 55,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  projectTreePanel: {
    backgroundColor: '#1a1a1a',
    position: 'absolute',
    left: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  alertPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 8,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomWidth: 0.3,
    borderBottomColor: '#333',
  },
  alertText: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyIcon: {
    fontSize: 16,
    color: '#bbb',
  },
  overlayDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    zIndex: 5,
  },
});