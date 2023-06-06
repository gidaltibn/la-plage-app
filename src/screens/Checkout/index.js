import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import heart from '../../assets/icons/heart.png';
import logo from '../../assets/icons/logo.png';
import house from '../../assets/icons/house.png';
import api from '../../services/api';
import { useEffect } from 'react';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function Checkout(params) {
    //console.log(params.route.params.info);
    const enderecoId = params.route.params.enderecoId;
    const [endereco, setEndereco] = useState({});
    const [cidade, setCidade] = useState({});
    const [estado, setEstado] = useState({});
    const precoTotal = params.route.params.info.precoTotal;
    const usuarioId = params.route.params.info.usuarioId;
    const produtosInfo = params.route.params.info.produtos;
    const [produtoSelecionados, setProdutosSelecionados] = useState([]);
    const [venda, setVenda] = useState({});

    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);


    const carregaProdutos = async () => {
        console.log(produtosInfo.length);
        for (let i = 0; i < produtosInfo.length; i++) {
            const response = await api.post("/produto/busca-id", { id: produtosInfo[i].id });
            //console.log(response.data);
            setProdutosSelecionados((prevProdutos) => [
                ...prevProdutos,
                { ...response.data, quantidade: produtosInfo[i].quantidade },
            ]);
        }
    }

    const carregaEndereco = async () => {
        const response = await api.post("/endereco/busca-id", { id: enderecoId });
        setEndereco(response.data);
        carregaCidade(response.data.cidadeId);
    }

    const carregaCidade = async (id) => {
        const response = await api.post("cidade/id", { id: id });
        setCidade(response.data);
        carregaEstado(response.data.estadoId);
    }

    const carregaEstado = async (id) => {
        const response = await api.post("estado/id", { id: id });
        setEstado(response.data);
        setLoading(false);
    }

    const salvarVenda = async () => {
        const response = await api.post("/venda", {
            usuarioId: usuarioId,
            precoTotal: precoTotal,
            statusDaCompra: "Em processamento",
            enderecoId: enderecoId
        });
        setVenda(response.data);

        for (let i = 0; i < produtoSelecionados.length; i++) {
            salvarProdutoVenda(response.data.id, produtoSelecionados[i].id, produtoSelecionados[i].quantidade, produtoSelecionados[i].preco);
        }
        limparCarrinho();
    }

    const salvarProdutoVenda = async (vendaId, produtoId, quantidade, preco) => {
        const response = await api.post("/produto-venda", {
            produtoId: produtoId,
            quantidade: quantidade,
            preco: preco,
            vendaId: vendaId
        });

        const response2 = await api.post("produto/busca-id", {
            id: produtoId
        });

        const produto = response2.data;
        const response3 = await api.post("produto/editar-produto", {
            id: produtoId,
            estoque: (produto.estoque - quantidade),
            status: true
        });
    }

    const limparCarrinho = async () => {
        const response = await api.post("/cart/usuario-id", {
            usuarioId: usuarioId
        });

        console.log(response.data.id);
        const response2 = await api.delete("/cart/" + response.data.id);
        console.log(response2.data);

        Alert.alert("Tudo certo!", "Sua compra está em processamento. Aguarde o envio do link para o pagamento!");
        
        navigation.goBack();
        navigation.goBack();
        navigation.goBack();
    }

    useEffect(() => {
        carregaProdutos();
        carregaEndereco();
    }, []);

    if (loading) {
        return (
            <View>
                <Text>Carregando...</Text>
            </View>
        )
    } else {
        //console.log(produtoSelecionados);
        return (
            <View style={styles.container}>
                <View style={styles.cabecalho}>
                    <TouchableOpacity style={styles.houseContainer}>

                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image resizeMode='contain' source={logo} style={styles.logoIcone} />
                    </View>
                    <TouchableOpacity style={styles.favoritosContainer}>

                    </TouchableOpacity>
                </View>
                <View style={styles.descricaoContainer}>
                    <View>
                        <Text style={styles.titulo}>Resumo da compra</Text>
                        <FlatList
                            data={produtoSelecionados}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                //console.log(item.quantidade);
                                return (
                                    <View style={styles.itens}>
                                        <Text style={styles.descricao}>
                                            Item: {item.nome}
                                        </Text>
                                        <Text style={styles.descricao}>
                                            Quantidade: {item.quantidade}
                                        </Text>
                                        <Text style={styles.descricao}>
                                            Valor/Un: R$ {item.preco}
                                        </Text>
                                    </View>

                                );
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.precoTotal}>Total: R$ {precoTotal}</Text>
                    </View>
                    <View>
                        <Text style={styles.titulo}>Entrega:</Text>
                        <Text style={styles.precoTotal}>Quem recebe:</Text>
                        <Text style={styles.descricao}>{endereco.destinatario}</Text>
                        <Text style={styles.precoTotal}>Endereço:</Text>
                        <Text style={styles.descricao}>Rua: {endereco.rua}, Número: {endereco.numero}, Complemento: {endereco.complemento}, Bairro: {endereco.bairro}, {cidade.nome}/{estado.uf}</Text>
                    </View>
                </View>
                <View style={styles.rodapeContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            salvarVenda();
                        }}
                        style={styles.novoEnderecoButton}
                    >
                        <Text style={styles.novoEnderecoText}>Confirmar pedido</Text>
                    </TouchableOpacity>
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
        height: '10%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    novoEnderecoButton: {
        width: '30%',
        height: '80%',
        backgroundColor: '#FDB981',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    novoEnderecoText: {
        fontSize: Dimensions.get('window').width / 28,
        color: 'white',
        fontWeight: '500',
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
    itens: {
        marginVertical: Dimensions.get('screen').height * 0.005,
    },
    titulo: {
        fontSize: Dimensions.get('screen').width / 28,
        fontWeight: 'bold',
        alignSelf: "center",
    },
    descricao: {
        fontSize: Dimensions.get('screen').width / 30,
        marginLeft: "10%",
    },
    precoTotal: {
        fontSize: Dimensions.get('screen').width / 28,
        fontWeight: 'bold',
    },

});
