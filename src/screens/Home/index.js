import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import envelope from '../../assets/icons/envelope.png';
import bag from '../../assets/icons/bag.png';
import bagPlus from '../../assets/icons/bag-plus.png';
import heart from '../../assets/icons/heart.png';
import heartFill from '../../assets/icons/heart-fill.png';
import list from '../../assets/icons/list.png';
import person from '../../assets/icons/person.png';
import search from '../../assets/icons/search.png';
import logo from '../../assets/icons/logo.png';
import praia from '../../assets/icons/praia.jpg';
import api from '../../services/api';
import SwiperFlatList from 'react-native-swiper-flatlist';

import { useSelector } from 'react-redux';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function Home() {


    //console.log(params.route.params);
    const usuario = undefined;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);

    async function fetchCategorias() {
        const response = await api.post("categoria/lista-categorias", {})
            .catch(function (error) { console.log(error) });
        await setCategorias(response.data.content);
    }

    async function carregaProdutos() {
        const response = await api.post("produto/lista-produtos", {})
            .catch(function (error) { console.log(error) });
        await setProdutos(response.data.content);
        setLoading(false);
    }

    async function carregaProdutosPorCategoria(id) {
        const response = await api.post("produto/lista-produtos-categoria", { categoriaId: id })
            .catch(function (error) { console.log(error) });
        await setProdutos(response.data.content);
        setLoading(false);
    }

    const carregaImagens = async () => {
        const resultado = await api.post("/imagem/lista-imagens");
        await setFotosExibir(resultado.data.content);
    }

    const testeLogin = () => {
        if (usuario === undefined) {
            console.log("usuario não logado");
            navigation.navigate('Auth', "Perfil");
        } else {
            console.log("usuario logado");
            navigation.navigate("Perfil", usuario);
        }
    }

    const [fotosExibir, setFotosExibir] = useState([]);

    useEffect(() => {
        fetchCategorias();
        carregaProdutos();
        carregaImagens();
    }, []);

    if (loading) {
        return (
            <View>
                <Text>CARREGANDO</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.cabecalho}>
                    <TouchableOpacity style={styles.perfilContainer} onPress={
                        () => testeLogin()
                    }>
                        <Image resizeMode='contain' source={person} style={styles.perfilIcone} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.notificacaoContainer}></TouchableOpacity>

                    <View style={styles.logoContainer}><Image resizeMode='contain' source={logo} style={styles.logoIcone} /></View>

                    <TouchableOpacity style={styles.favoritosContainer}></TouchableOpacity>

                    <TouchableOpacity style={styles.carrinhoContainer}></TouchableOpacity>

                </View>
                <View style={styles.busca}>
                    <TextInput style={styles.buscaInput} />
                    <TouchableOpacity style={styles.buscaIconeContainer}><Image resizeMode='contain' source={search} style={styles.bagIcone} /></TouchableOpacity>
                </View>
                <View style={styles.barraDestaques}>
                    <Image resizeMode='cover' source={praia} style={styles.imagemDestaque} />
                </View>
                <View style={styles.barraCategorias}>

                    <FlatList
                        horizontal
                        data={categorias}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.categoriasContainer}>
                                    <TouchableOpacity style={styles.itemCategoria} onPress={() => {
                                        if (item.nome === "Todas") {
                                            carregaProdutos();
                                        } else {
                                            carregaProdutosPorCategoria(item.id);
                                        }
                                    }} >
                                        <Text style={styles.textoCategoria}>{item.nome}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                </View>
                <View style={styles.conteudo}>
                    <FlatList
                        data={produtos}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            const fotosProduto = fotosExibir.filter(foto => foto.produtoId === item.id);
                            const parametro = {
                                produto: item,
                                usuario: usuario
                            }
                            return (
                                <TouchableOpacity style={styles.itemBotao} onPress={() => navigation.navigate('Products', parametro)} >
                                    <View style={styles.item}>
                                        {fotosProduto.length > 0 && (
                                            <SwiperFlatList
                                                autoplayDelay={5}
                                                showPagination={false}
                                                data={fotosProduto}
                                                renderItem={({ item: foto }) => (
                                                    <Image
                                                        source={{ uri: foto.urlImagem }}
                                                        style={styles.galeriaImagens}
                                                        resizeMode="stretch"
                                                    />
                                                )}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.texto}>{item.nome}</Text>
                                </TouchableOpacity>
                            );
                        }}
                        numColumns={2}
                    />

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: '2%',
        paddingBottom: '2%',
    },
    cabecalho: {
        width: "100%",
        height: "6%",
        alignItems: "center",
        flexDirection: 'row',
        paddingHorizontal: '2%',
        justifyContent: 'space-between'
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
    busca: {
        width: "100%",
        height: "6%",
        alignItems: "center",
        flexDirection: 'row',
        paddingHorizontal: '2%',
        justifyContent: 'center',
    },
    buscaInput: {
        width: "75%",
        height: "60%",
        backgroundColor: "#F0F0F0",
        borderRadius: 10,
        elevation: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    buscaIconeContainer: {
        width: "8%",
        height: "50%",
        marginLeft: 10,
    },
    conteudo: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
    },
    barraDestaques: {
        width: "90%",
        height: "20%",
        alignItems: "center",
        alignSelf: 'center',
        paddingHorizontal: '2%',
        borderRadius: 15,
    },
    imagemDestaque: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
    },
    texto: {
        fontSize: Dimensions.get('screen').width / 23,
        alignSelf: 'center',
        textAlign: 'center',
    },
    barraCategorias: {
        width: "100%",
        height: "6%",
        flexDirection: 'row',
    },
    categoriasContainer: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
    },
    textoCategoria: {
        fontSize: Dimensions.get('screen').width / 25,
        marginHorizontal: 30,
        color: 'white',
    },
    itemCategoria: {
        height: "60%",
        width: '100%',
        backgroundColor: '#D95C14',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        elevation: 5,
    },
    containerConteudo: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemBotao: {
        marginRight: 5,
        width: Dimensions.get('screen').width / 2 - 30,
        margin: 5, // Espaçamento entre os itens
        marginHorizontal: "3%", // Espaçamento entre os itens
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    item: {
        width: "100%", // Defina a largura com base no tamanho da tela e no espaço que deseja entre os itens
        height: Dimensions.get('screen').height * 0.15, // Defina a altura com base na largura para manter um quadrado
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: 5,
    },
    galeriaImagens: {
        width: Dimensions.get('screen').width * 0.44,
        resizeMode: 'stretch',
        aspectRatio: 4 / 3,
        alignSelf: "center",
        borderRadius: 10,
    },

});
