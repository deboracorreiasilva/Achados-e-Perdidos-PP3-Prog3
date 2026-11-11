import { useState } from "react";
import { StyleSheet, Text, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, mensagemErro } from './firebaseConfig';

const Cadastrar = () => {
  const [email, onChangeEmail] = useState("");
  const [senha, onChangeSenha] = useState("");
  const [nome, onChangeNome] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const cadastrar = async () => {
    setErro("");

    if (!nome.trim() || !email.trim() || !senha) {
      setErro("Preencha nome, email e senha.");
      return;
    }

    setCarregando(true);
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(credencial.user, { displayName: nome.trim() });
    } catch (e) {
      setErro(mensagemErro(e));
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={{ marginVertical: 75, fontSize: 24, marginLeft: 20 }}>Cadastrar</Text>

        <Text style={styles.text}>Nome</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNome}
          value={nome}
          placeholder="Digite seu nome"
        />

        <Text style={styles.text}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Digite seu email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.text}>Senha</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeSenha}
          value={senha}
          placeholder="Digite sua senha (mín. 6 caracteres)"
          secureTextEntry={true}
        />

        {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

        <Pressable
          style={styles.pressable}
          onPress={cadastrar}
          disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text style={{ color: '#121212' }}>Cadastrar</Text>
          )}
        </Pressable>
      </ScrollView>
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
  pressable: {
    backgroundColor: '#AFA9FF',
    width: 220,
    height: 40,
    borderRadius: 35,
    marginTop: 50,
    padding: 10, 
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default Cadastrar;