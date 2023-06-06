import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
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
import house from '../../assets/icons/house.png';
import praia from '../../assets/icons/praia.jpg';
import CounterInput from "react-native-counter-input";
import api from '../../services/api';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function Cart(params) {
    const usuarioId = params.route?.params;

    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [itensCarrinho, setItensCarrinho] = useState({});
    let [somaPreco, setSomaPreco] = useState(0);
    const [produtos, setProdutos] = useState([]);
    const [fotos, setFotos] = useState([]);

    const [parametros, setParametros] = useState({});

    const [contabilizaProdutos, setContabilizaProdutos] = useState([]);

    const carregarProduto = async (itensCarrinho) => {
        setProdutos([]);
        let i = 0;
        while (i < itensCarrinho.length) {
            await api.post("produto/busca-id", { id: itensCarrinho[i] })
                .then((response) => {
                    setProdutos(prevProdutos => [...prevProdutos, response.data]);
                    const itemExistente = contabilizaProdutos.find(item => item.id === response.data.id);
                    if (itemExistente) {
                        setContabilizaProdutos(prevProdutos => [...prevProdutos]);
                    } else {
                        setContabilizaProdutos(prevProdutos => [...prevProdutos, { id: response.data.id, preco: response.data.preco, quantidade: 1 }]);
                    }
                    setSomaPreco(somaPreco => somaPreco + response.data.preco);
                    i++;
                });
        }
        setLoading(false);
    }

    const carregaItensCarrinho = async (id) => {
        await api.post("/cart-item/listar-cart-item", { cartId: id })
            .then((response) => {
                setItensCarrinho(response.data.content);
                let produtosId = [];
                let i;
                for (i = 0; i < response.data.content.length; i++) {
                    produtosId.push(response.data.content[i].produtoId);
                    carregaImagemProduto(response.data.content[i].produtoId);
                }
                carregarProduto(produtosId);
            });
    }

    const carregaCarrinho = async () => {
        await api.post("/cart/usuario-id", { usuarioId: usuarioId })
            .then((response) => {
                carregaItensCarrinho(response.data.id);
            });
    }

    const carregaImagemProduto = async (id) => {
        //console.log(id);
        const response = await api.post("/imagem/produto-id-imagem-id", { id: 1, produtoId: id });
        console.log(response.data);
    }

    const exibeImagem = async (id) => {
        console.log(id);
        console.log(fotos.length);
        let fotoSelecionada;
        for (let i=1; i<fotos.length; i++){
            if (fotos[i].produtoId === id){
                fotoSelecionada = fotos[i].urlImagem;
                return fotoSelecionada;
            }
        }
    }

    useEffect(() => {
        carregaCarrinho();
        carregaImagemProduto();
    }, []);

    const [counterValue, setCounterValue] = useState(1);
    const [quantidade, setQuantidade] = useState(1);
    const [quantidades, setQuantidades] = useState();

    const handleCounterChange = (value, produto) => {
        console.log(contabilizaProdutos);
        if (value === 0) {
            Alert.alert("Ei!", "Você deseja remover o item do seu carrinho?", [

                {
                    text: 'Sim',
                    onPress: () => {
                        removerItem(produto.id);
                    },
                },
                {
                    text: 'Não',
                    onPress: () => { },
                    style: 'cancel',
                },
                ,
            ]);
        }
        setContabilizaProdutos(prevState => {
            const newArray = prevState.map(item => {
                if (item.id === produto.id) {
                    return { ...item, quantidade: value };
                }
                return item;
            });

            calculaValorTotal(newArray);

            return newArray;
        });

    };

    useEffect(() => {
        calculaValorTotal(contabilizaProdutos);
    }, [contabilizaProdutos]);

    const calculaValorTotal = (produtos) => {
        let soma = 0;
        for (let i = 0; i < produtos.length; i++) {
            soma += produtos[i].preco * produtos[i].quantidade;
        }
        setSomaPreco(soma);
    };

    const removerItem = async (id) => {
        let itemId;
        for (let i = 0; i < itensCarrinho.length; i++) {
            if (itensCarrinho[i].produtoId === id) {
                itemId = itensCarrinho[i].id;
            }
        }
        const response = api.delete("/cart-item/" + itemId);
        Alert.alert("Tudo certo!", "O item foi removido da sua sacola!");
        await carregaCarrinho();
    }

    if (loading) {
        return (
            <View><Text>Carregando</Text></View>
        );
    } else {

        return (
            <View style={styles.container}>
                <View style={styles.cabecalho}>
                    <TouchableOpacity style={styles.houseContainer} onPress={() => navigation.navigate('Home')}>
                        <Image resizeMode='contain' source={house} style={styles.houseIcone} />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image resizeMode='contain' source={logo} style={styles.logoIcone} />
                    </View>
                    <TouchableOpacity style={styles.favoritosContainer}>
                        <Image resizeMode='contain' source={heart} style={styles.favoritoIcone} />
                    </TouchableOpacity>
                </View>
                <View style={styles.descricaoContainer}>

                    <View style={styles.produtosCart}>
                        <FlatList
                            data={produtos}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                //setSomaPreco(somaPreco+item.preco);
                                const foto = carregaImagemProduto(item.id);
                                console.log(foto);
                                return (
                                    <View style={styles.itemCartContainer}>
                                        <Image source={praia} style={styles.imagemCartContainer} />
                                        <View style={styles.infoProdutoCartContainer}>
                                            <Text style={styles.nomeProdutoText}>{item.nome}</Text>
                                            <Text style={styles.categoriaProdutoText}>Hot Pants</Text>
                                            <Text style={styles.precoProdutoText}>{item.preco}</Text>
                                        </View>

                                        <CounterInput
                                            increaseButtonBackgroundColor={'#FDB981'}
                                            min={0}
                                            max={item.estoque}
                                            initial={counterValue}
                                            onChange={(value) => {
                                                handleCounterChange(value, item);
                                            }}
                                        //editable={false}
                                        />
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <View style={styles.rodapeContainer}>
                        <View style={styles.precoTotalContainer}>
                            <Text style={styles.total}>Total</Text>
                            <Text style={styles.precoTotal}>R${somaPreco}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            const parametro = { usuarioId: usuarioId, precoTotal: somaPreco, produtos: contabilizaProdutos }
                            navigation.navigate("ListaEnderecos", parametro);
                            //console.log(contabilizaProdutos)
                            //console.log(somaPreco)
                        }} style={styles.comprarButton}>
                            <Text style={styles.comprarText}>Continuar compra</Text>
                        </TouchableOpacity>
                    </View>
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
    houseContainer: {
        width: "8%",
        height: "35%",
    },
    houseIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    perfilContainer: {
        width: "8%",
        height: "35%",
        marginRight: '30%',
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
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    logoIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    favoritosContainer: {
        width: "8%",
        height: "35%",
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
        fontSize: Dimensions.get('window').width / 20,
        alignSelf: 'center',
    },
    containerConteudo: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemBotao: {
        marginRight: 5,
        width: Dimensions.get('window').width / 2 - 30,
        margin: 5, // Espaçamento entre os itens
        marginHorizontal: "3%", // Espaçamento entre os itens
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    item: {
        width: "100%", // Defina a largura com base no tamanho da tela e no espaço que deseja entre os itens
        height: Dimensions.get('window').height / 2 - 150, // Defina a altura com base na largura para manter um quadrado
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        elevation: 5,
    },
    descricaoContainer: {
        flex: 1,
        padding: '5%',
    },
    produtosCart: {
        width: '100%',
        height: '89%',
    },
    itemCartContainer: {
        flex: 1,
        padding: '3%',
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        marginBottom: '3%',
        elevation: 5,
        marginHorizontal: '3%',
        flexDirection: 'row',
        marginTop: '2%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagemCartContainer: {
        width: '25%',
        height: 100,
        borderRadius: 15,
        marginRight: '4%',
    },
    infoProdutoCartContainer: {
        width: '30%',
        height: 100,
        marginRight: '4%',
        justifyContent: 'center',
    },
    nomeProdutoText: {
        fontSize: Dimensions.get('window').width / 25,
        fontWeight: '500',
    },
    categoriaProdutoText: {
        fontSize: Dimensions.get('window').width / 30,
        color: '#A0A0A0',
        fontWeight: '500',
    },
    precoProdutoText: {
        fontWeight: 'bold',
        fontSize: Dimensions.get('window').width / 20,
    },
    selctorQtdCartContainer: {
        width: '15%',
        height: 100,
        justifyContent: 'center',
    },
    rodapeContainer: {
        width: '100%',
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    comprarButton: {
        width: '50%',
        height: '80%',
        backgroundColor: '#FDB981',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    comprarText: {
        fontSize: Dimensions.get('window').width / 20,
        color: 'white',
        fontWeight: '500',
    },
    precoTotal: {
        fontSize: Dimensions.get('window').width / 20,
        fontWeight: 'bold',
    },
    precoTotalContainer: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
    },
    total: {
        fontSize: Dimensions.get('window').width / 25,
        fontWeight: 'bold',
        color: 'grey',
    },

});
