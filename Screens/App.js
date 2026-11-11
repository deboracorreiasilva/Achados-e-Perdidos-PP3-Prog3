import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebaseConfig';
import Inicial from './Inicial';
import RegistrarItem from './RegistrarItem';
import Item from './Item';
import Login from './Login';
import Cadastrar from './Cadastrar';
import Perfil from './Perfil';

const Stack = createNativeStackNavigator(); {/* O que é isso?? */}

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
                    <Ionicons name="person-circle-outline" size={32} color="#000" />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen name="RegistrarItem" component={RegistrarItem} />
            <Stack.Screen name="Item" component={Item} />
            <Stack.Screen name="Perfil" component={Perfil} />
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