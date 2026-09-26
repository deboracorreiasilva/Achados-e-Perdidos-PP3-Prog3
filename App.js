import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { TextInput } from 'react-native';
import { ListItem, SearchBar, Icon, Image, Avatar } from 'react-native-elements';
import { Header } from '@rneui/themed';
import { StyleSheet, Text, View, Pressable, Alert, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import {  createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute, NavigationContainer } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';

const LoginScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Login/>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const Login = () => {
  const [email, onChangeEmail]=useState("");
  const [senha, onChangeSenha]= useState("")
  return (
    <SafeAreaProvider>
      <SafeAreaView >
        
        <Header
          leftComponent = {{
            text: 'Achados e Perdidos - IFPE JG', 
            color: '#060505'}}
          containerStyle = {{backgroundColor: '#acabab'}}
        />

        <View style={styles.container}>
          <Text style={{ marginVertical: 75, fontSize: 24}}>Login</Text>
          <Text  style={styles.text}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Digite seu email"
          />
          <Text style={styles.text}>Senha</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeSenha}
            value={senha}
            placeholder="Digite sua senha"
          />
          <Pressable 
            style={{fontSize: 30}}
            onPress={() => Alert.alert('"Esqueceu a senha?" pressionado')}>
            <Text>Esqueceu a senha?</Text>
          </Pressable>

          <Pressable
            style={styles.pressable}
            onPress={() => Alert.alert('Botão de entrar pressionado')}>
            <Text  style={styles.text_botao}>Entrar</Text>
          </Pressable>

          <Pressable
            style={[styles.pressable, { backgroundColor: "#D9D9D9", width: 170,  marginTop: 10 }]}
            onPress={() => Alert.alert('Botão de Cadastar Pressionado')}>
            <Text style={styles.text_botao}>Cadastrar</Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const Cadastrar = () => {
  const [email, onChangeEmail] = useState("");
  const [senha, onChangeSenha] = useState("");
  const [nome, onChangeNome] = useState("");
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Header
          leftComponent = {{
            text: 'Achados e Perdidos - IFPE JG', 
            color: '#060505'}}
          containerStyle = {{backgroundColor: '#acabab'}}
        />

        <View style={styles.container}>
      
          <Text style={{ marginVertical: 75, fontSize: 24
          }}>Cadastar</Text>
          <Text  style={styles.text}>Nome</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNome}
            value={nome}
            placeholder="Digite seu nome"
          />

          <Text  style={styles.text}>Email</Text>

          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder="Digite seu email"
            keyboardType = 'email-address'
          />

        <Text style={styles.text}>Senha</Text>

        <TextInput
          style={styles.input}
          onChangeText={onChangeSenha}
          value={senha}
          placeholder="Digite sua senha"
          keyboardType = 'visible-password'
        />

        <Pressable
          style={styles.pressable}
          onPress={() => Alert.alert('Botão de cadastar pressionado')}>
          <Text style={styles.text_botao}>Cadastrar</Text>
        </Pressable>

      </View>
      
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const Inicial = () => {
  //de SearchBar - React Native elements
  //const [pesquisa, setPesquisa] = useState("");

  const [ pesquisa, onChangePesquisa ] = useState("");

  const itens = [
    {
      nome: 'Item 1',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7CuFWYHxngNBxvuv_fCb6Gc_J0znbdDM2DIHX-xY8jQ&s',
      //icon: 'apparel',
      descricao: 'O item 1 foi encontrado em tal lugar em tal dia'
    },
    {
      nome: 'Item 2',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ6kRNdZzBxQ2nXriy7lsr72-ii7iBbzc7HfLqzDEK_w&s=10',
      //icon: 'cards-stack',
      descricao: 'O item 2 foi encontrado em tal lugar em tal dia'
    },
    {
      nome: 'Item 3',
      avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ6kRNdZzBxQ2nXriy7lsr72-ii7iBbzc7HfLqzDEK_w&s=10',
      //icon: 'cards-stack',
      descricao: 'O item 3 foi encontrado em tal lugar em tal dia'
    },
  ]

   //do ListItem - React Native Elements

  return (

    <SafeAreaProvider>
      <SafeAreaView>

        <Header
          leftComponent = {{
            text: 'Achados e Perdidos - IFPE JG', 
            color: '#060505'}}
          rightComponent = {{
            icon: 'person', 
            color: '#1d1c1c'}}
          containerStyle = {{backgroundColor: '#acabab'}}
        />

        {/*<SearchBar
          placeholder='Pesquisar...'
          onChangeText={this.setPesquisa}
          value = {pesquisa}
        />*/}

        <TextInput
          style={styles.barra_pesquisa}
          inlineImageLeft='search_icon'
          inputMode='search'
          onChangeText = {onChangePesquisa}
          value = {pesquisa}
        />

        <View style = {styles.itens}>
        {
          itens.map(( item, i ) => (
            <ListItem key = {i} style = {styles.item}>
              <ListItem.Content>
                <Avatar source = {{uri: item.avatar_url}} style={styles.imagem}/>
                <ListItem.Title>
                    {item.nome}
                </ListItem.Title>
                <ListItem.Subtitle>
                    {item.descricao}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            ))
        }
        </View>

      </SafeAreaView>
    </SafeAreaProvider>

  )
}

const RegistrarItem = () => {

  const [titulo, onChangeTitulo] = useState("");
  const [local, onChangeLocal] = useState("");
  const [descricao, onChangeDescricao] = useState("");
  const [data, onChangeData] = useState("");

  //de Dropdown Picker em: https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/usage
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [opcoes, setOpcoes] = useState([
    {label: 'Garrafa', value: 'garrafa'},
    {label: 'Relógio', value: 'relogio'},
  ]);

  const itens = [
    {id: 1, title: 'Garrafa', value: 'garrafa'},
    {id: 2, title: 'Relógio', value: 'relogio'},
  ]

  //https://docs.expo.dev/versions/latest/sdk/imagepicker/

  /*
  const [imagem, setImagem] = useState <string | null> (null);
  const escolherImagem = async () => {
    const permissaoResultado = await ImagePicker.requestMediaLibraryPermissionAsync();

    if(!permissaoResultado.granted) {
      Alert.alert('Permissão necessária', 'Permissão para acessar a biblioteca de imagens é necessária');
      return;
    };

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(resultado);

    if(!resultado.canceled){
      setImagem(resultado.assets[0].uri);
    };
  };

  const tirarFoto = async () => {
    const permissaoResultado = await ImagePicker.requestCameraPermissionsAsync();

    if(!permissaoResultado.granted){
      Alert.alert('Permissão necessária', 'Permissão para acessar a câmera é necessária');
      return;
    };

    let resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });

    console.log(resultado);

    if(!resultado.canceled){
      setImagem(resultado.assets[0].uri);
    }
  };*/

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <Header
          leftComponent = {{
            text: 'Achados e Perdidos - IFPE JG', 
            color: '#060505'}}
          rightComponent = {{
            icon: 'person', 
            color: '#1d1c1c'}}
          containerStyle = {{backgroundColor: '#acabab', width: '100%'}}
        />

        <View style={styles.view}>
          {/*<Text style={styles.text}>Foto</Text>
          <Pressable
            style={styles.pressable}
            onPress={(escolherImagem) => Alert.alert('Botão de  escolher imagem pressionado')}>
            <Text style={styles.text_botao}>Escolher Imagem</Text>
          </Pressable>

          <Pressable
            style={styles.pressable}
            onPress={(tirarFoto) => Alert.alert('Botão de  tirar foto pressionado')}>
            <Text style={styles.text_botao}>Tirar Foto</Text>
          </Pressable>*/}
          
          <Text  style={styles.text}>Título</Text>

          <TextInput
            style={styles.input_quest}
            value={titulo}
            onChangeText={onChangeTitulo}
          />

          <Text style={styles.text}>Tipo</Text>
          
          <DropDownPicker
            style={{
              margin: 20,
              width: 300,
            }}
            open={open}
            value={value}
            itens={opcoes}
            setOpen={setOpen}
            setValue={setValue}
            setItens={setOpcoes}
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

          <Text style={styles.text}>Descricao</Text>

          <TextInput
            style={styles.descricao}
            value={descricao}
            onChangeText={onChangeDescricao}
            //multiline = 'true'
          />

          <Pressable
            style={styles.pressable}
            onPress={() => Alert.alert('Botão de registrar item pressionado')}>
            <Text style={styles.text_botao}>Registrar Item</Text>
          </Pressable>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RegistrarItem" screenOptions={{headerStyle: {
        backgroundColor: '#D9D9D9'
      }}}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false, title: "Achados e Perdidos"}} />
        <Stack.Screen name="Cadastrar" component={Cadastrar}  options={{ headerShown: false, title: "Achados e Perdidos"}} />
        <Stack.Screen name="Inicial" component={Inicial} options={{ headerShown: false }}
        />
        <Stack.Screen name="RegistrarItem" component={RegistrarItem} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    justifyContent: 'center',
    alignContent: 'stretch',
  },
  input: { 
    borderWidth: 2,
    borderRadius: 100,
    height: 40,
    width: 320,
    padding: 10,
    margin: 10,
    paddingLeft: 20,
    backgroundColor: '#D9D9D9',
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
  barra_pesquisa: { 
    borderWidth: 1,
    borderRadius: 100,
    height: 40,
    width: 320,
    padding: 10,
    margin: 10,
    paddingLeft: 20,
    backgroundColor: '#e3e2e2',
    alignSelf: 'center',
  },
  text: {
    marginEnd: 250,
    marginHorizontal: 30,
    fontSize: 17
  },
  text_botao: {
    color: '#121212',

  },
  pressable: {
    backgroundColor: '#AFA9FF',
    width: 220,
    height: 10,
    borderRadius: 35,
    marginTop: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itens: {
    flexDirection: 'row',
    alignItem: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 25,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  item: {
    height: '50%',
    maxHeight: 320,
    width: '40%',
    minWidth: 230,
    maxWidth: 260,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#e2dcdc',
    boxShadow: '0px 2px 4px rgba(59, 59, 59, 0.21)',
  },
  //https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow
  imagem: {
    height: 200,
    width: 200,
  },
});

export default App;
