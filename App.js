import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = () => {
    // TODO: xử lý đăng nhập
    console.log('Sign in', { email, password });
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 50}}></View>
      <View style = {styles.header}>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Email/Username</Text>
        <TextInput
          style={styles.textInputZone}
          value={email}
          onChangeText={setEmail}
          placeholder="test@mail.com"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.textInputZone}
          value={password}
          onChangeText={setPassword}
          placeholder="● ● ● ●"
          secureTextEntry
        />
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onSignIn} style={[styles.button]}>
        <Text style={[styles.buttonText]}>Sign In</Text>
      </TouchableOpacity>       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  header: { 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24, 
    marginTop: 50, 
    fontWeight: 'bold'
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'left',
  },
  textInputZone: {
    width: '100%',
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  forgot: {
    marginTop: 8,
    color: '#333',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    },
    buttonText: { fontSize: 16, fontWeight: '600' },
});
