import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

//https://reactnative.dev/docs/tutorial

const itens = [
  {
    nome: 'Item 1',
    avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7CuFWYHxngNBxvuv_fCb6Gc_J0znbdDM2DIHX-xY8jQ&s',
    local: 'Sala 01',
    data: '10/09/2026',
    //icon: 'apparel',
    descricao: 'O item 1 foi encontrado em tal lugar em tal dia'
  },
  {
    nome: 'Item 2',
    avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ6kRNdZzBxQ2nXriy7lsr72-ii7iBbzc7HfLqzDEK_w&s=10',
    local: 'Sala 16',
    data: '23/07/2026',
    //icon: 'cards-stack',
    descricao: 'O item 2 foi encontrado em tal lugar em tal dia'
  },
  {
    nome: 'Item 3',
    avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ6kRNdZzBxQ2nXriy7lsr72-ii7iBbzc7HfLqzDEK_w&s=10',
    local: 'Sala 11',
    data: '17/02/2026',
    //icon: 'cards-stack',
    descricao: 'O item 3 foi encontrado em tal lugar em tal dia'
  },
]

const itensExemplo = itens.map((item, indice) => ({
  id: `exemplo-${indice}`,
  titulo: item.nome,
  imagem: item.avatar_url,
  local: item.local,
  data: item.data,
  descricao: item.descricao,
}));

const ABAS = [
  { chave: 'todos', rotulo: 'Todos' },
  { chave: 'meus', rotulo: 'Meus' },
  { chave: 'solicitados', rotulo: 'Solicitados' },
];

const MENSAGEM_VAZIA = {
  todos: 'Nenhum item encontrado.',
  meus: 'Você ainda não registrou nenhum item.',
  solicitados: 'Você ainda não solicitou a recuperação de nenhum item.',
};

const ItemCard = ({ item }) => (
  <View style={styles.item}>
    {item.imagem ? (
      <Image
        source={{ uri: item.imagem }}
        style={styles.imagem}
      />
    ) : (
      <View style={[styles.imagem, styles.semImagem]}>
        <Ionicons name="image-outline" size={60} color="#aaa" />
      </View>
    )}
    <Text style={styles.titulo_item}>{item.titulo}</Text>
    {item.local || item.data ? (
      <Text style={styles.text_item}>{item.local} - {item.data}</Text>
    ) : null}
    <Text style={styles.text_item} numberOfLines={2}>{item.descricao}</Text>
    {item.recuperacaoSolicitadaPor ? (
      <Text style={styles.aviso_item} numberOfLines={1}>
        Pedido de: {item.recuperacaoSolicitadaPor.nome}
      </Text>
    ) : null}
  </View>
);

const Inicial = () => {
  //de SearchBar - React Native elements
  //const [pesquisa, setPesquisa] = useState("");
  const navigation = useNavigation();

  const [pesquisa, onChangePesquisa] = useState("");
  const [aba, setAba] = useState('todos');
  const [itensBanco, setItensBanco] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const consulta = query(collection(db, 'itens'), orderBy('criadoEm', 'desc'));
    const cancelar = onSnapshot(
      consulta,
      (snapshot) => {
        setItensBanco(
          snapshot.docs.map((documento) => {
            const { criadoEm, ...dados } = documento.data();
            return { id: documento.id, ...dados };
          })
        );
        setCarregando(false);
      },
      (erro) => {
        console.log('Erro ao carregar itens:', erro);
        setCarregando(false);
      }
    );
    return cancelar;
  }, []);

  const uid = auth.currentUser?.uid;

  // itens de exemplo só aparecem na aba "Todos"
  const porAba =
    aba === 'meus'
      ? itensBanco.filter((item) => item.donoId === uid)
      : aba === 'solicitados'
        ? itensBanco.filter((item) => item.recuperacaoSolicitadaPor?.id === uid)
        : [...itensBanco, ...itensExemplo];

  const termo = pesquisa.trim().toLowerCase();
  const itensFiltrados = porAba.filter((item) =>
    !termo ||
    [item.titulo, item.local, item.data].some((campo) =>
      (campo || '').toLowerCase().includes(termo)
    )
  );

  const renderItem = ({ item }) => {

    return (
      <View style={styles.itens}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor='#ddd'
          onPress={() => navigation.navigate('Item', { item })}
        >
          <ItemCard
            item={item}
          />
        </TouchableHighlight>
      </View>
    )
  }

  //do ListItem - React Native Elements

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        {/*<SearchBar
          placeholder='Pesquisar...'
          onChangeText={this.setPesquisa}
          value = {pesquisa}
        />*/}

        <TextInput
          style={styles.barra_pesquisa}
          inputMode='search'
          placeholder="Pesquisar por título, local ou data..."
          onChangeText={onChangePesquisa}
          value={pesquisa}
        />

        <Pressable
          style={styles.reg_item}
          onPress={() => navigation.navigate('RegistrarItem')}
        >
          <Text style={styles.text_botao}>Registrar Item Perdido</Text>
        </Pressable>

        <View style={styles.abas}>
          {ABAS.map((a) => (
            <Pressable
              key={a.chave}
              style={[styles.aba, aba === a.chave && styles.abaAtiva]}
              onPress={() => setAba(a.chave)}
            >
              <Text style={[styles.abaTexto, aba === a.chave && styles.abaTextoAtivo]}>
                {a.rotulo}
              </Text>
            </Pressable>
          ))}
        </View>

        {carregando ? (
          <ActivityIndicator size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={itensFiltrados}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.vazio}>{MENSAGEM_VAZIA[aba]}</Text>
            }
          />
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
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
  reg_item: {
    borderRadius: 100,
    height: 40,
    width: 200,
    padding: 10,
    margin: 10,
    backgroundColor: '#94b6f6',
    alignSelf: 'flex-start',
  },
  abas: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
  },
  aba: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginHorizontal: 4,
    backgroundColor: '#e3e2e2',
  },
  abaAtiva: {
    backgroundColor: '#b7afff',
  },
  abaTexto: {
    color: '#555',
  },
  abaTextoAtivo: {
    color: '#121212',
    fontWeight: '600',
  },
  text_botao: {
    color: '#121212',
    alignSelf: 'center',
  },
  itens: {
    marginTop: 20,
    marginHorizontal: 30,
  },
  item: {
    height: 230,
    width: 230,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#e2dcdc',
    boxShadow: '0px 2px 4px rgba(59, 59, 59, 0.21)',
    backgroundColor: '#ededed',
    alignSelf: 'flex-start',
    padding: 5,
  },
  titulo_item: {
    fontSize: 15,
    margin: 5,
  },
  text_item: {
    fontSize: 12,
    marginBottom: 3,
    marginLeft: 10,
  },
  aviso_item: {
    fontSize: 12,
    color: '#2e7d32',
    marginLeft: 10,
  },
  //https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow
  imagem: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    margin: 8,
    borderRadius: 10,
  },
  semImagem: {
    backgroundColor: '#dcdcdc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vazio: {
    marginTop: 40,
    fontSize: 16,
    color: '#555',
  },
});

export default Inicial;