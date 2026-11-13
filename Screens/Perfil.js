import { useState } from "react";
import { StyleSheet, Text, View, Pressable, Alert, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

const Perfil = ({ navigation }) => {
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const usuario = auth.currentUser;
  const nome = usuario?.displayName || 'Usuário';
  const email = usuario?.email || '';

  const selecionarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à sua galeria para escolher uma foto de perfil.'
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled) {
        setFotoPerfil(resultado.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto.');
    }
  };

  const sair = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
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

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={() => Alert.alert('Meu Perfil', 'Botão "Meu Perfil" pressionado')}
      >
        <Ionicons name="person-outline" size={29} color="#aaa" />
        <Text style={styles.textoBotao}>Meu Perfil</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        onPress={() => Alert.alert('Configurações','Botão "Configurações" pressionado')}
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
  voltar: {
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  nome: {
    //fontSize: 23,
    fontSize: 22,
    fontWeight: '400',
    color: '#111',
    marginBottom: 2,
  },
  email: {
    //fontSize: 21,
    fontSize: 16,
    fontWeight: '400',
    color: '#111',
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