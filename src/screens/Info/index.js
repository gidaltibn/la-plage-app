import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import envelope from '../../assets/icons/envelope.png';
import bag from '../../assets/icons/bag.png';
import heart from '../../assets/icons/heart.png';
import person from '../../assets/icons/person.png';
import logo from '../../assets/icons/logo.png';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { CommonActions } from '@react-navigation/native';

export default function Info(params) {
    const usuario = params.route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [foto, setFoto] = useState();

    const carregaFoto = async () => {
        const response = await api.post("/foto-perfil/usuario-id", {
            usuarioId: usuario.id
        });
        setFoto(response.data);
        setLoading(false);
    }

    useEffect(() => {
        carregaFoto();
    }, []);

    if (loading) {
        return (
            <View>
                <Text>Carregando</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.cabecalho}>
                    <TouchableOpacity style={styles.notificacaoContainer}>

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.perfilContainer}>

                    </TouchableOpacity>

                    <View style={styles.logoContainer}><Image resizeMode='contain' source={logo} style={styles.logoIcone} /></View>

                    <TouchableOpacity style={styles.favoritosContainer}>

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.carrinhoContainer}>

                    </TouchableOpacity>

                </View>
                <View style={styles.dadosContainer}>
                    <Image source={foto.urlImagem !== '' ? { uri: foto.urlImagem } : null} style={styles.foto} />
                    <Text style={styles.textoNome}>{usuario.nome}</Text>
                </View>
                <View style={styles.opcoes}>
                    <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate("Perfil", usuario)}>
                        <Text style={styles.optionText}>Meus dados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionContainer} onPress={() => {
                        const parametro = { usuarioId: usuario.id }
                        navigation.navigate("MeusEnderecos", parametro);
                        //console.log(contabilizaProdutos)
                        //console.log(somaPreco)
                    }}>
                        <Text style={styles.optionText}>Meus endereços</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionContainer} onPress={() => {
                        navigation.navigate("MeusPedidos", usuario);
                    }}>
                        <Text style={styles.optionText}>Meus pedidos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionContainer} onPress={
                        () => navigation.navigate('Cart', usuario.id)
                    }>
                        <Text style={styles.optionText}>Minha sacola de compras</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionContainer} onPress={
                        () => {
                            navigation.dispatch(CommonActions.reset({
                                index: 0, // Define o índice da tela ativa na nova pilha
                                routes: [{ name: 'Home' }], // Define as telas da nova pilha
                            }));
                        }
                    }>
                        <Text style={styles.optionText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    optionContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 20,
        borderRadius: 10,
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cabecalho: {
        width: "100%",
        height: "5%",
        alignItems: "center",
        flexDirection: 'row',
        paddingHorizontal: '2%',
        justifyContent: 'space-between'
    },
    dadosContainer: {
        width: "100%",
        height: "5%",
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%',
    },
    opcoes: {
        marginTop: "10%",
        width: "100%",
        height: "70%",
    },
    notificacaoContainer: {
        width: "8%",
        height: "35%",
    },
    notificacaoIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    perfilContainer: {
        width: "8%",
        height: "35%",
    },
    perfilIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    logoContainer: {
        width: "25%",
        height: "100%",
        alignSelf: 'center',
        marginLeft: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    favoritosContainer: {
        width: "8%",
        height: "35%",
        marginLeft: '16%',
    },
    favoritoIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    carrinhoContainer: {
        width: "8%",
        height: "35%",
    },
    bagIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    foto: {
        width: Dimensions.get('screen').width * 0.13,
        aspectRatio: 1,
        borderRadius: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    textoNome: {
        fontSize: Dimensions.get('screen').width / 25,
        marginLeft: '2%',
        fontWeight: 'bold',
    },
});