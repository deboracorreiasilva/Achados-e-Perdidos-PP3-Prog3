import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCoZ58oog6QtQSK8hdg-cBo_Te3yYoYvTU",
  authDomain: "pp3-debora.firebaseapp.com",
  projectId: "pp3-debora",
  storageBucket: "pp3-debora.firebasestorage.app",
  messagingSenderId: "869263799732",
  appId: "1:869263799732:web:914856d05c22452dedaee1",
  measurementId: "G-0RD3EYN5EP"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    auth = getAuth(app);
  }
}

export const mensagemErro = (error) => {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Email inválido.';
    case 'auth/missing-password':
      return 'Digite a senha.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este email já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet.';
    case 'auth/operation-not-allowed':
      return 'Login por email e senha não está ativado no Firebase.';
    default:
      return 'Algo deu errado. Tente novamente.';
  }
};

const db = getFirestore(app);

export { app, auth, db };