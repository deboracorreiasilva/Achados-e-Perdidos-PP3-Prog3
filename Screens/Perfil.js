import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Alert, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { processar, comLimite } from './utilitarios';

const Perfil = ({ navigation }) => {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [erro, setErro] = useState("");

  const usuario = auth.currentUser;
  const nome = usuario?.displayName || 'Usuário';
  const email = usuario?.email || '';

  useEffect(() => {
    if (!usuario) return;
    return onSnapshot(
      doc(db, 'usuarios', usuario.uid),
      (s) => setFotoPerfil(s.data()?.foto || null),
      () => setErro('Não foi possível carregar a foto.')
    );
  }, []);

  const selecionarFoto = async () => {
    setErro("");
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permita o acesso à galeria para escolher uma foto.');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled) {
        const uri = await processar(resultado.assets[0]);
        await comLimite(setDoc(doc(db, 'usuarios', usuario.uid), { foto: uri }, { merge: true }));
      }
    } catch (e) {
      setErro(e.message === 'timeout' ? 'Demorou demais para salvar. Verifique sua conexão.' : e.message);
    }
  };

  const sair = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      setErro('Não foi possível sair. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.perfil}>
        <Pressable style={styles.fotoContainer} onPress={selecionarFoto}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.foto} />
          ) : (
            <Ionicons name="person-outline" size={62} color="#707070" />
          )}
          <View style={styles.camera}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
          </View>
        </Pressable>

        <View style={styles.informacoes}>
          <Text style={styles.nome}>{nome}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={() => navigation.navigate('MeusItens')}
      >
        <Ionicons name="list-outline" size={29} color="#aaa" />
        <Text style={styles.textoBotao}>Meus itens</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={() => navigation.navigate('ItensSolicitados')}
      >
        <Ionicons name="hand-left-outline" size={29} color="#aaa" />
        <Text style={styles.textoBotao}>Itens solicitados</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={() => Alert.alert('Configurações', 'Botão "Configurações" pressionado')}
      >
        <Ionicons name="settings-outline" size={31} color="#aaa" />
        <Text style={styles.textoBotao}>Configurações</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={sair}
      >
        <Ionicons name="log-out-outline" size={32} color="#aaa" />
        <Text style={styles.textoBotao}>Sair</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 35,
    paddingHorizontal: 2,
    width: '80%',
  },
  fotoContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#d6d6d6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  camera: {
    position: 'absolute',
    right: -2,
    bottom: 1,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  informacoes: {
    marginLeft: 28,
    justifyContent: 'center',
  },
  botaoPressionado: {
    backgroundColor: '#eeeeee',
    transform: [{ scale: 0.99 }],
  },
  nome: {
    fontSize: 22,
    fontWeight: '400',
    color: '#111',
    marginBottom: 2,
  },
  email: {
    fontSize: 16,
    fontWeight: '400',
    color: '#111',
  },
  erro: {
    color: '#c62828',
    marginBottom: 20,
    maxWidth: 320,
    textAlign: 'center',
  },
  botao: {
    width: '60%',
    height: 70,
    borderRadius: 36,
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 27,
    marginBottom: 39,
  },
  textoBotao: {
    fontSize: 20,
    fontWeight: '400',
    color: '#111',
    marginLeft: 19,
  },
});

export default Perfil;