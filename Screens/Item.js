import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

//https://reactnative.dev/docs/tutorial
//banco de dados => https://firebase.google.com/docs/firestore?hl=pt-br

//atualizar versao do node pra v24.22.21 pro firebase rodar normalmente
//https://nodejs.org/pt-br/download

const Item = ({ route }) => {
  const item = route.params?.item;

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Item não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {item.imagem ? (
        <Image source={{ uri: item.imagem }} style={styles.imagem} />
      ) : (
        <View style={[styles.imagem, styles.semImagem]}>
          <Ionicons name="image-outline" size={80} color="#aaa" />
        </View>
      )}

      <Text style={styles.titulo}>{item.titulo}</Text>

      <Text style={styles.rotulo}>Tipo</Text>
      <Text style={styles.valor}>{item.tipo || 'Não informado'}</Text>

      <Text style={styles.rotulo}>Local</Text>
      <Text style={styles.valor}>{item.local || 'Não informado'}</Text>

      <Text style={styles.rotulo}>Data</Text>
      <Text style={styles.valor}>{item.data || 'Não informado'}</Text>

      <Text style={styles.rotulo}>Descrição</Text>
      <Text style={styles.valor}>{item.descricao || 'Sem descrição'}</Text>

      <Text style={styles.rotulo}>Registrado por</Text>
      <Text style={styles.valor}>{item.donoNome || item.donoEmail || 'Não informado'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ececec',
    alignItems: 'flex-start',
    padding: 24,
    flexGrow: 1,
  },
  imagem: {
    height: 220,
    width: 220,
    alignSelf: 'center',
    marginBottom: 20,
  },
  semImagem: {
    backgroundColor: '#dcdcdc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 13,
    color: '#666',
    marginTop: 12,
  },
  valor: {
    fontSize: 17,
  },
});

export default Item;