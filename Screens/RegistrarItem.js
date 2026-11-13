import { useState } from "react";
import {
  StyleSheet, Text, ScrollView, Pressable, Alert, View, TextInput, Image, ActivityIndicator, Animated, Keyboard
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

//https://reactnative.dev/docs/tutorial

const RegistrarItem = ({ navigation }) => {
  const [titulo, onChangeTitulo] = useState("");
  const [local, onChangeLocal] = useState("");
  const [descricao, onChangeDescricao] = useState("");
  const [data, onChangeData] = useState("");
  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  //de Dropdown Picker em: https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/usage
  /*const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Garrafa', value: 'garrafa' },
    { label: 'Relógio', value: 'relogio' },
  ]);*/

  //https://docs.expo.dev/versions/latest/sdk/imagepicker/
  const escolherImagem = async () => {
    const permissaoResultado = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissaoResultado.granted) {
      Alert.alert('Permissão necessária', 'Permissão para acessar a biblioteca de imagens é necessária');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const tirarFoto = async () => {
    const permissaoResultado = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissaoResultado.granted) {
      Alert.alert('Permissão necessária', 'Permissão para acessar a câmera é necessária');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const registrar = async () => {
    setErro("");

    if (!titulo.trim() || !local.trim() || !data.trim()) {
      setErro("Preencha título, local e data.");
      return;
    }

    setSalvando(true);
    try {
      await addDoc(collection(db, 'itens'), {
        titulo: titulo.trim(),
        local: local.trim(),
        data: data.trim(),
        descricao: descricao.trim(),
        imagem: null,
        donoId: auth.currentUser.uid,
        donoNome: auth.currentUser.displayName || '',
        donoEmail: auth.currentUser.email,
        criadoEm: serverTimestamp(),
      });
      navigation.goBack();
    } catch (e) {
      setErro("Não foi possível registrar o item. Tente novamente.");
      setSalvando(false);
    }
  };

  //https://medium.com/free-code-camp/how-to-make-your-react-native-app-respond-gracefully-when-the-keyboard-pops-up-7442c1535580 = integração do teclado

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.view}
      >
        <View style={styles.quest}>
          <Text style={styles.text}>Foto</Text>

          {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}

          <Pressable style={styles.pressable} onPress={escolherImagem}>
            <Text style={styles.text_botao}>Escolher Imagem</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={tirarFoto}>
            <Text style={styles.text_botao}>Tirar Foto</Text>
          </Pressable>

          <Text style={styles.text}>Título</Text>

          <TextInput
            style={styles.input_quest}
            value={titulo}
            onChangeText={onChangeTitulo}
          />

          <Text style={styles.text}>Local</Text>

          <TextInput
            style={styles.input_quest}
            value={local}
            onChangeText={onChangeLocal}
          />

          <Text style={styles.text}>Data</Text>

          <TextInput
            style={styles.input_quest}
            value={data}
            onChangeText={onChangeData}
          />
          <Text style={{color: 'red',}}>escolher data pelo calendário</Text>

          <Text style={styles.text}>Descricao</Text>

          <TextInput
            style={styles.descricao}
            value={descricao}
            onChangeText={onChangeDescricao}
            multiline={true}
          />

          {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

          <Pressable
            style={styles.pressable}
            onPress={registrar}
            disabled={salvando}>
            {salvando ? (
              <ActivityIndicator color="#121212" />
            ) : (
              <Text style={styles.text_botao}>Registrar Item</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignContent: 'stretch',
    width: '100%',
    paddingBottom: 40,
  },
  quest: {
    width: '100%',
  },
  input_quest: {
    borderWidth: 1,
    height: 40,
    width: 320,
    padding: 10,
    margin: 20,
    paddingLeft: 20,
    backgroundColor: '#fffefe',
  },
  descricao: {
    borderWidth: 1,
    minHeight: 40,
    width: 320,
    padding: 10,
    margin: 20,
    paddingLeft: 20,
    backgroundColor: '#fffefe',
  },
  text: {
    marginEnd: 250,
    marginHorizontal: 30,
    fontSize: 17,
  },
  erro: {
    color: '#c62828',
    marginHorizontal: 30,
    marginVertical: 8,
    maxWidth: 320,
  },
  text_botao: {
    color: '#121212',
    alignSelf: 'center',
  },
  pressable: {
    borderRadius: 100,
    height: 40,
    width: 200,
    padding: 10,
    margin: 10,
    backgroundColor: '#bebbf7',
    alignSelf: 'flex-start',
  },
  //https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow
  imagem: {
    height: 200,
    width: 200,
    margin: 20,
  },
});

export default RegistrarItem;