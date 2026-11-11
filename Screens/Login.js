import { useState } from "react";
import { StyleSheet, Text, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, mensagemErro } from './firebaseConfig';

const Login = ({ navigation }) => {
  const [email, onChangeEmail] = useState("");
  const [senha, onChangeSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const entrar = async () => {
    setErro("");
    setAviso("");

    if (!email.trim() || !senha) {
      setErro("Preencha o email e a senha.");
      return;
    }

    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      setErro(mensagemErro(e));
      setCarregando(false);
    }
  };

  const esqueceuSenha = async () => {
    setErro("");
    setAviso("");

    if (!email.trim()) {
      setErro("Digite seu email para receber o link de redefinição.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAviso("Enviamos um link de redefinição para o seu email.");
    } catch (e) {
      setErro(mensagemErro(e));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={{ marginVertical: 75, fontSize: 24, marginLeft: 20 }}>Login</Text>

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
          placeholder="Digite sua senha"
          secureTextEntry={true}
        />

        {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
        {aviso !== "" && <Text style={styles.aviso}>{aviso}</Text>}

        <Pressable onPress={esqueceuSenha}>
          <Text style={{ fontSize: 15 }}>Esqueceu a senha?</Text>
        </Pressable>

        <Pressable
          style={styles.pressable}
          onPress={entrar}
          disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text style={{ color: '#121212' }}>Entrar</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.pressable, { backgroundColor: "#D9D9D9", width: 170, marginTop: 10 }]}
          onPress={() => navigation.navigate('Cadastrar')}>
          <Text style={{ color: '#121212' }}>Cadastrar</Text>
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
  aviso: {
    color: '#2e7d32',
    marginHorizontal: 30,
    marginVertical: 8,
    maxWidth: 320,
  },
  pressable: {
    backgroundColor: '#AFA9FF',
    width: 200,
    height: 40,
    borderRadius: 35,
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

});

export default Login;