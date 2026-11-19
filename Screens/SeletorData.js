import { useState, createElement } from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const doisDigitos = (n) => String(n).padStart(2, '0');

export const formatarData = (d) =>
  `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;

const paraDate = (texto) => {
  const [d, m, a] = (texto || '').split('/').map(Number);
  return d && m && a ? new Date(a, m - 1, d) : new Date();
};

const paraISO = (texto) => {
  if (!texto) return '';
  const [d, m, a] = texto.split('/');
  return `${a}-${m}-${d}`;
};

const SeletorData = ({ value, onChange }) => {
  const [aberto, setAberto] = useState(false);
  const hoje = new Date();

  if (Platform.OS === 'web') {
    return createElement('input', {
      type: 'date',
      value: paraISO(value),
      max: paraISO(formatarData(hoje)),
      onChange: (e) => {
        const v = e.target.value;
        if (!v) {
          onChange('');
          return;
        }
        const [a, m, d] = v.split('-');
        onChange(`${d}/${m}/${a}`);
      },
      style: {
        height: 40,
        width: 320,
        margin: 20,
        padding: 10,
        border: '1px solid #000',
        backgroundColor: '#fffefe',
        boxSizing: 'border-box',
      },
    });
  }

  const aoMudar = (event, selecionada) => {
    if (Platform.OS === 'android') setAberto(false);
    if (event.type === 'set' && selecionada) onChange(formatarData(selecionada));
  };

  return (
    <View>
      <Pressable style={styles.campo} onPress={() => setAberto(true)}>
        <Text style={value ? styles.valor : styles.placeholder}>
          {value || 'Toque para escolher a data'}
        </Text>
        <Ionicons name="calendar-outline" size={22} color="#555" />
      </Pressable>

      {aberto && (
        <DateTimePicker
          value={value ? paraDate(value) : hoje}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={hoje}
          onChange={aoMudar}
        />
      )}

      {aberto && Platform.OS === 'ios' && (
        <Pressable style={styles.ok} onPress={() => setAberto(false)}>
          <Text style={styles.okTexto}>OK</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  campo: {
    borderWidth: 1,
    height: 40,
    width: 320,
    margin: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fffefe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valor: {
    color: '#121212',
  },
  placeholder: {
    color: '#999',
  },
  ok: {
    alignSelf: 'center',
    backgroundColor: '#94b6f6',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  okTexto: {
    color: '#121212',
  },
});

export default SeletorData;