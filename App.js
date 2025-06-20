// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LiquidEditor from './LiquidEditor';

export default function App() {
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return <LiquidEditor />;
  }
// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper'; // ← añadido
import LiquidEditor from './LiquidEditor';

export default function App() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <PaperProvider> {/* ← envuelve todo */}
      {showEditor ? (
        <LiquidEditor />
      ) : (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setShowEditor(true)} style={styles.button}>
            <Text style={styles.text}>Editor</Text>
          </TouchableOpacity>
        </View>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  button: {
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowEditor(true)} style={styles.button}>
        <Text style={styles.text}>Editor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  button: {
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
