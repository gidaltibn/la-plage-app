import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import envelope from '../../assets/icons/envelope.png';
import bag from '../../assets/icons/bag.png';
import bagPlus from '../../assets/icons/bag-plus.png';
import heart from '../../assets/icons/heart.png';
import heartFill from '../../assets/icons/heart-fill.png';
import api from '../../services/api';
import SwiperFlatList from 'react-native-swiper-flatlist';

export default function Products(params) {
    const prod = params.route.params.produto;
    const [produto, setProduto] = useState();

    const usuario = params.route.params.usuario;


    const [carrinho, setCarrinho] = useState(null);
    const [itemCarrinho, setItemCarrinho] = useState();
    const [quantidade, setQuantidade] = useState(1);

    const navigation = useNavigation();
    const precoNormal = String(produto?.preco).replace(".", ",");

    const carregaImagens = async (id) => {
        const resultado = await api.post("/imagem/produto-imagens", { produtoId: id });
        await setFotosExibir(resultado.data.content);
        //await console.log(resultado.data.content);
    }

    const carregaProduto = async (id) => {
        const response = await api.post("produto/busca-id", { id: id });
        setProduto(response.data);
        carregaImagens(response.data.id);
    }


    const adicionaItemAoCarrinho = async () => {
        let buscaCarrinho;
        if (carrinho !== null) {
            console.log("adicionando logo o item");
            const teste = await api.post("/cart-item/cart-produto", { produtoId: produto.id, cartId: carrinho.id });
            console.log(teste.data);
            if (teste.data === undefined) {
                const response = await api.post("/cart-item", {
                    cartId: carrinho.id,
                    produtoId: produto.id,
                    quantidade: quantidade
                });
            } else {
                Alert.alert("Ops!", "Esse produto já está em sua sacola de compras!");
            }
        } else {

            console.log("carrinho nulo");
            const response = await api.post("cart/usuario-id", {
                usuarioId: usuario.id
            });
            buscaCarrinho = response.data;
            //console.log(typeof response.data);

            if (buscaCarrinho === "") {
                console.log("criando carrinho");
                const response = await api.post("/cart", { usuarioId: usuario.id });

                const response2 = await api.post("/cart-item", {
                    cartId: response.data.id,
                    produtoId: produto.id,
                    quantidade: quantidade
                });
                console.log(response2.data);
                Alert.alert("Produto adicionado à sacola.");

            } else {
                console.log("não precisa criar carrinho, o usuário já tem um");
                const teste = await api.post("/cart-item/cart-produto", { produtoId: produto.id, cartId: buscaCarrinho.id });
                //console.log(typeof teste.data);
                if (teste.data === "") {
                    const response2 = await api.post("/cart-item", {
                        cartId: buscaCarrinho.id,
                        produtoId: produto.id,
                        quantidade: quantidade
                    });
                    //console.log(response2.data);
                    Alert.alert("Produto adicionado à sacola.");
                } else {
                    Alert.alert("Ops!", "Esse produto já está em sua sacola de compras!");
                }

            }
        }
    }

    const verificarLogin = () => {
        //console.log(usuario);
        if (usuario === undefined) {
            navigation.navigate("Auth", "Products");
        } else {
            adicionaItemAoCarrinho();
        }
    }
    const verificarLoginCarrinho = () => {
        //console.log(usuario);
        if (usuario === undefined) {
            navigation.navigate("Auth", "Products");
        } else {
            navigation.navigate("Cart", usuario.id);
        }
    }

    const [fotosExibir, setFotosExibir] = useState([]);

    useEffect(() => {
        carregaProduto(prod.id);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.fotosContainer}>
                <View style={styles.item}>
                    {fotosExibir.length > 0 && (
                        <SwiperFlatList
                            autoplayDelay={5}
                            showPagination={true}
                            data={fotosExibir}
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
            </View>
            <View style={styles.iconesContainer}>
                <TouchableOpacity style={styles.favoritarIconeContainer}
                    onPress={() => {
                        Alert.alert("Ops!", "Esta funcionalidade ainda não está ativa. Aguarde!");
                    }}
                >
                    <Image resizeMode='contain' source={heart} style={styles.favoritoIcone} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.carrinhoIconeContainer}
                    onPress={() => {
                        verificarLoginCarrinho();
                    }}
                >
                    <Image resizeMode='contain' source={bag} style={styles.bagIcone} />
                </TouchableOpacity>
            </View>
            <View style={styles.descricaoContainer}>
                <View style={styles.tituloContainer}>
                    <Text style={styles.titulo}>{produto?.nome}</Text>
                    <Text style={styles.preco}>R$ {precoNormal}</Text>
                </View>
                <Text>Peças em estoque: {produto?.estoque}</Text>
                <View style={styles.detalhesContainer}>
                    <Text style={styles.detalhe}>
                        {produto?.descricao}
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.comprarButton}
                        onPress={() => {
                            if (produto.estoque === 0) {
                                Alert.alert("Ops!", "Infelizmente esse produto está com estoque zerado.")
                            } else {
                                verificarLogin();
                            }
                        }}
                    >
                        <Text style={styles.comprarText}>Adicionar à sacola</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fotosContainer: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.335,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        backgroundColor: '#FDB981',
        elevation: 20,
    },
    item: {
        width: "100%",
        height: Dimensions.get('screen').height * 0.34,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        elevation: 5,
    },
    galeriaImagens: {
        width: Dimensions.get('screen').width,
        resizeMode: 'stretch',
        aspectRatio: 4 / 3,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    iconesContainer: {
        width: '100%',
        height: '5%',
        position: 'absolute',
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: '5%',
        paddingRight: '5%',
        alignItems: 'center',
    },
    favoritarIconeContainer: {
        height: '80%',
        width: '9%',
        backgroundColor: '#F0F0F0',
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    favoritoIcone: {
        width: "65%",
        height: "65%",
        tintColor: '#FDB981',
    },
    carrinhoIconeContainer: {
        height: '80%',
        width: '9%',
        backgroundColor: '#F0F0F0',
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    bagIcone: {
        width: "65%",
        height: "65%",
        tintColor: '#FDB981',
    },
    descricaoContainer: {
        flex: 1,
        paddingHorizontal: '5%',
        justifyContent: 'space-between',
    },
    tituloContainer: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titulo: {
        fontSize: Dimensions.get('screen').width / 20,
        fontWeight: 'bold',
    },
    subtitulo: {},
    preco: {
        fontSize: Dimensions.get('screen').width / 20,
        fontWeight: 'bold',
    },
    detalhesContainer: {
        width: '100%',
        height: '50%',
        justifyContent: 'center',
    },
    detalhe: {
        fontSize: Dimensions.get('screen').width / 25,
        color: '#5F5F5F'
    },
    buttonsContainer: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('screen').height * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'baseline'
    },
    comprarButton: {
        width: Dimensions.get('screen').width * 0.5,
        height: Dimensions.get('screen').height * 0.08,
        backgroundColor: '#FDB981',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    comprarText: {
        fontSize: Dimensions.get('screen').width / 20,
        color: 'white',
        fontWeight: '500',
    },
    addCarrinhoButton: {
        width: Dimensions.get('screen').width * 0.2,
        height: Dimensions.get('screen').width * 0.2,
        backgroundColor: '#FDB981',
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bagPlusIcone: {
        width: "35%",
        height: "35%",
        tintColor: '#F0F0F0',
    },
});
