import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const ListaItens = ({ route, navigation }) => {
    const tipo = route.params?.tipo; // 'meus' ou 'solicitados'
    const [itens, setItens] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let cancelarConsulta = () => { };

        const cancelarAuth = onAuthStateChanged(auth, (user) => {
            cancelarConsulta();
            if (!user) {
                setCarregando(false);
                return;
            }

            const campo = tipo === 'meus' ? 'donoId' : 'recuperacaoSolicitadaPor.id';
            const consulta = query(collection(db, 'itens'), where(campo, '==', user.uid));

            cancelarConsulta = onSnapshot(
                consulta,
                (snapshot) => {
                    const lista = snapshot.docs.map((d) => {
                        const { criadoEm, ...dados } = d.data();
                        return { id: d.id, ...dados, _ordem: criadoEm?.toMillis?.() || 0 };
                    });
                    lista.sort((a, b) => b._ordem - a._ordem);
                    setItens(lista);
                    setCarregando(false);
                },
                (erro) => {
                    console.log('Erro ao carregar lista:', erro);
                    setCarregando(false);
                }
            );
        });

        return () => {
            cancelarAuth();
            cancelarConsulta();
        };
    }, [tipo]);

    if (carregando) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

    return (
        <FlatList
            style={{ backgroundColor: '#ececec' }}
            contentContainerStyle={{ padding: 20 }}
            data={itens}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
                <Text style={styles.vazio}>
                    {tipo === 'meus'
                        ? 'Você ainda não registrou nenhum item.'
                        : 'Você ainda não solicitou a recuperação de nenhum item.'}
                </Text>
            }
            renderItem={({ item }) => (
                <Pressable style={styles.card} onPress={() => navigation.navigate('Item', { item })}>
                    {item.imagem ? (
                        <Image source={{ uri: item.imagem }} style={styles.imagem} />
                    ) : (
                        <View style={[styles.imagem, styles.semImagem]}>
                            <Ionicons name="image-outline" size={30} color="#aaa" />
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.titulo}>{item.titulo}</Text>
                        <Text style={styles.sub}>{item.local} - {item.data}</Text>
                        {tipo === 'meus' && item.recuperacaoSolicitadaPor && (
                            <Text style={styles.aviso}>
                                Pedido de: {item.recuperacaoSolicitadaPor.nome}
                            </Text>
                        )}
                    </View>
                </Pressable>
            )}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ededed',
        borderWidth: 2,
        borderColor: '#e2dcdc',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
    },
    imagem: { height: 70, width: 70, borderRadius: 10, marginRight: 12 },
    semImagem: { backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' },
    titulo: { fontSize: 16 },
    sub: { fontSize: 12, color: '#555' },
    aviso: { fontSize: 12, color: '#2e7d32', marginTop: 4 },
    vazio: { marginTop: 40, fontSize: 16, color: '#555', textAlign: 'center' },
});

export default ListaItens;