import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, Alert, Platform, } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { doc, onSnapshot, updateDoc, deleteDoc, deleteField } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

//https://reactnative.dev/docs/tutorial
//banco de dados => https://firebase.google.com/docs/firestore?hl=pt-br

//atualizar versao do node pra v24.22.21 pro firebase rodar normalmente
//https://nodejs.org/pt-br/download

const Item = ({ route, navigation }) => {
  const [item, setItem] = useState(route.params?.item);
  const itemId = route.params?.item?.id;

  useEffect(() => {
    if (!itemId) return;
    const cancelar = onSnapshot(
      doc(db, 'itens', itemId),
      (snapshot) => {
        if (snapshot.exists()) {
          const { criadoEm, ...dados } = snapshot.data();
          setItem({ id: snapshot.id, ...dados });
        }
      },
      (erro) => console.log('Erro ao carregar item:', erro)
    );
    return cancelar;
  }, [itemId]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Item não encontrado</Text>
      </View>
    );
  }

  const ehDono = !!item.donoId && item.donoId === auth.currentUser?.uid;

  const usuario = auth.currentUser;
  const ehExemplo = String(item.id).startsWith('exemplo-'); // itens de exemplo não existem no banco
  const solicitante = item.recuperacaoSolicitadaPor;
  const euSolicitei = solicitante?.id === usuario?.uid;

  const solicitarRecuperacao = async () => {
    try {
      await updateDoc(doc(db, 'itens', item.id), {
        recuperacaoSolicitadaPor: {
          id: usuario.uid,
          nome: usuario.displayName || usuario.email,
        },
      });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível solicitar a recuperação.');
    }
  };

  const cancelarSolicitacao = async () => {
    try {
      await updateDoc(doc(db, 'itens', item.id), {
        recuperacaoSolicitadaPor: deleteField(),
      });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível cancelar o pedido.');
    }
  };

  const avisar = (titulo, mensagem) => {
    if (Platform.OS === 'web') window.alert(mensagem);
    else Alert.alert(titulo, mensagem);
  };

  const apagar = () => {
    const excluir = async () => {
      try {
        await deleteDoc(doc(db, 'itens', item.id));
        navigation.goBack();
      } catch (e) {
        console.log('Erro ao apagar:', e);
        avisar('Erro', 'Não foi possível apagar o item.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja apagar este item?')) excluir();
      return;
    }

    Alert.alert('Apagar item', 'Tem certeza que deseja apagar este item?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: excluir },
    ]);
  };

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

      <Text style={styles.rotulo}>Local</Text>
      <Text style={styles.valor}>{item.local || 'Não informado'}</Text>

      <Text style={styles.rotulo}>Data</Text>
      <Text style={styles.valor}>{item.data || 'Não informado'}</Text>

      <Text style={styles.rotulo}>Descrição</Text>
      <Text style={styles.valor}>{item.descricao || 'Sem descrição'}</Text>

      <Text style={styles.rotulo}>Registrado por</Text>
      <Text style={styles.valor}>{item.donoNome || item.donoEmail || 'Não informado'}</Text>

      {solicitante && (
        <>
          <Text style={styles.rotulo}>Pedido para recuperação de</Text>
          <Text style={styles.valor}>{solicitante.nome}</Text>
        </>
      )}

      {!ehDono && !ehExemplo && !solicitante && (
        <Pressable style={styles.botao} onPress={solicitarRecuperacao}>
          <Text style={styles.text_botao}>Recuperar item</Text>
        </Pressable>
      )}

      {euSolicitei && (
        <Pressable style={styles.botao} onPress={cancelarSolicitacao}>
          <Text style={styles.text_botao}>Cancelar pedido</Text>
        </Pressable>
      )}

      {ehDono && (
        <>
          <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate('EditarItem', { item })}
          >
            <Text style={styles.text_botao}>Editar Item</Text>
          </Pressable>

          {!solicitante && (
            <Pressable style={[styles.botao, { backgroundColor: '#f4a6a6' }]} onPress={apagar}>
              <Text style={styles.text_botao}>Apagar Item</Text>
            </Pressable>
          )}
        </>
      )}

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
  botao: {
    borderRadius: 100,
    height: 40,
    width: 200,
    padding: 10,
    margin: 12,
    backgroundColor: '#b7afff',
    alignSelf: 'flex-start',
  },
  text_botao: {
    color: '#121212',
    alignSelf: 'center',
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