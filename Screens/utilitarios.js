import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const LIMITE_IMAGEM = 700000;

export const comLimite = (promessa, ms = 15000) =>
  Promise.race([
    promessa,
    new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error('timeout')), ms)),
  ]);

const processar = async (asset) => {
  let dataUri;
  try {
    const reduzida = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    dataUri = `data:image/jpeg;base64,${reduzida.base64}`;
  } catch (e) {
    throw new Error('Não foi possível processar a imagem.');
  }

  if (dataUri.length > LIMITE_IMAGEM) {
    throw new Error('A imagem ficou grande demais. Escolha outra foto.');
  }
  return dataUri;
};

export const escolherDaGaleria = async () => {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissao.granted) {
    Alert.alert('Permissão necessária', 'Permissão para acessar a biblioteca de imagens é necessária');
    return null;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (resultado.canceled) return null;
  return processar(resultado.assets[0]);
};

export const tirarFotoCamera = async () => {
  const permissao = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissao.granted) {
    Alert.alert('Permissão necessária', 'Permissão para acessar a câmera é necessária');
    return null;
  }

  const resultado = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (resultado.canceled) return null;
  return processar(resultado.assets[0]);
};