import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  const [savedPasswords, setSavedPasswords] = useState([]);

  // Login Screen
  const LoginScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      generateCaptcha();
    }, []);

    const generateCaptcha = () => {
      const captchaValue = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
      setCaptcha(captchaValue.toString());
    };

    const handleLogin = () => {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name.');
        return;
      }
      if (userInput !== captcha) {
        Alert.alert('Error', 'CAPTCHA does not match. Try again.');
        generateCaptcha();
        return;
      }
      setIsVerified(true);
      navigation.replace('Home'); // Navigate to the home screen
    };

    return (
      <View style={styles.container}>
        <View >
          <Text style={styles.title}>Welcome to Password Manager</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#000"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>CAPTCHA: {captcha}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter CAPTCHA"
          placeholderTextColor="#000"
          value={userInput}
          onChangeText={setUserInput}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Home Screen
  const HomeScreen = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [useUppercase, setUseUppercase] = useState(false);
    const [useNumbers, setUseNumbers] = useState(false);
    const [useSymbols, setUseSymbols] = useState(false);
    const [passwordLength, setPasswordLength] = useState(12);

    const generatePassword = () => {
      const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
      const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numberChars = '0123456789';
      const symbolChars = '!@#$%^&*()-_=+[]{};:,.<>?/';

      let characterPool = lowerCaseChars;
      if (useUppercase) characterPool += upperCaseChars;
      if (useNumbers) characterPool += numberChars;
      if (useSymbols) characterPool += symbolChars;

      if (characterPool === '') {
        Alert.alert('Error', 'Please select at least one character type!');
        return;
      }

      let generatedPassword = '';
      for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        generatedPassword += characterPool[randomIndex];
      }

      setPassword(generatedPassword);
    };

    const savePassword = () => {
      if (password) {
        setSavedPasswords([...savedPasswords, password]);
        Alert.alert('Saved!', 'Password saved successfully.');
      } else {
        Alert.alert('Error', 'No password to save.');
      }
    };

    const resetPassword = () => {
      setPassword('');
      Alert.alert('Reset!', 'Password has been reset.');
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}> Password Generator 🔐</Text>
        <TextInput
          style={styles.passwordInput}
          value={password}
          placeholder="Generated password"
          placeholderTextColor="#888"
          editable={false}
        />
        <TouchableOpacity style={styles.saveButton} onPress={savePassword}>
          <Text style={styles.saveButtonText}>Save Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewSavedButton}
          onPress={() => navigation.navigate('SavedPasswords')}>
          <Text style={styles.viewSavedButtonText}>View Saved Passwords</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Password Length: {passwordLength}</Text>
        <Slider
          style={styles.slider}
          minimumValue={6}
          maximumValue={20}
          step={1}
          value={passwordLength}
          onValueChange={(value) => setPasswordLength(value)}
          minimumTrackTintColor="#88c"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#66b"
        />
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, useUppercase && styles.selected]}
            onPress={() => setUseUppercase(!useUppercase)}>
            <Text style={styles.optionText}>Uppercase</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, useNumbers && styles.selected]}
            onPress={() => setUseNumbers(!useNumbers)}>
            <Text style={styles.optionText}>Numbers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, useSymbols && styles.selected]}
            onPress={() => setUseSymbols(!useSymbols)}>
            <Text style={styles.optionText}>Symbols</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generatePassword}>
          <Text style={styles.generateButtonText}>Generate Password</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Saved Passwords Screen
  const SavedPasswordsScreen = ({ navigation }) => {
    const copyToClipboard = (password) => {
      Alert.alert('Copied!', `Password copied: ${password}`);
    };

    const deletePassword = (index) => {
      const updatedPasswords = savedPasswords.filter((_, i) => i !== index);
      setSavedPasswords(updatedPasswords);
      Alert.alert('Deleted!', 'Password has been deleted.');
    };

    const resetAllPasswords = () => {
      setSavedPasswords([]);
      Alert.alert('Reset!', 'All saved passwords have been deleted.');
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔒 Saved Passwords</Text>
        <FlatList
          data={savedPasswords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.passwordCard}>
              <Text style={styles.passwordText}>{item}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(item)}>
                  <Text style={styles.copyButtonText}>📂</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deletePassword(index)}>
                  <Text style={styles.deleteButtonText}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No passwords saved yet.</Text>
          }
        />
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetAllPasswords}>
          <Text style={styles.resetButtonText}>Delete All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SavedPasswords" component={SavedPasswordsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222', // Light mint color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight:700,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#88c', // Soft blue
    padding: 12,
    borderRadius: 15,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#53bbe0', // Blue
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#53bbe0', // Orange
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '30%',
    alignItems: 'center',
    elevation: 3,
  },
  selected: {
    backgroundColor: '#88c', // Selected state color
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#45a633', // Blue
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
    width:
  '100%',
    alignItems: 'center',
    elevation: 5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewSavedButton: {
    backgroundColor: '#555AAA', // Yellow
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  viewSavedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#444', // Dark gray
    padding: 12,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    marginLeft:10,
    marginRight:10,
  },
  passwordText: {
    color: '#fff',
    fontSize: 16,
    // flex: 1,
  },
  copyButton: {
    backgroundColor: '#88c',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    elevation: 3,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#e54d42',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

