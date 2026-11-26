import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import Inicial from './Inicial';
import RegistrarItem from './RegistrarItem';
import Item from './Item';
import EditarItem from './EditarItem';
import Login from './Login';
import Cadastrar from './Cadastrar';
import Perfil from './Perfil';
import ListaItens from './ListaItens';

const Stack = createNativeStackNavigator(); {/* O que é isso?? */ }

const FotoPerfil = () => {
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    return onSnapshot(doc(db, 'usuarios', uid), (s) => setFoto(s.data()?.foto || null), () => { });
  }, []);

  return foto ? (
    <Image source={{ uri: foto }} style={{ width: 32, height: 32, borderRadius: 16 }} />
  ) : (
    <Ionicons name="person-circle-outline" size={32} color="#000" />
  );
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return cancelar;
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          title: 'Achados e Perdidos',
          headerStyle: { backgroundColor: '#c0bcbc' },
        }}
      >
        {usuario ? (
          <>
            <Stack.Screen
              name="Inicial"
              component={Inicial}
              options={({ navigation }) => ({
                headerRight: () => (
                  <Pressable onPress={() => navigation.navigate('Perfil')}>
                    <FotoPerfil />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen name="RegistrarItem" component={RegistrarItem} />
            <Stack.Screen name="Item" component={Item} />
            <Stack.Screen name="EditarItem" component={EditarItem} />
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen
              name="MeusItens"
              component={ListaItens}
              initialParams={{ tipo: 'meus' }}
              options={{ title: 'Meus itens' }}
            />
            <Stack.Screen
              name="ItensSolicitados"
              component={ListaItens}
              initialParams={{ tipo: 'solicitados' }}
              options={{ title: 'Itens solicitados' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastrar" component={Cadastrar} />
          </>

        )}
      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;