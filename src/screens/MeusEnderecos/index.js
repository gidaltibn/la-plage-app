import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/icons/logo.png';
import api from '../../services/api';
import { useEffect } from 'react';
import { MaskedTextInput } from 'react-native-mask-text';
import { Picker } from '@react-native-picker/picker';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function MeusEnderecos(params) {
    const informacoes = params.route.params;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const [destinatario, setDestinatario] = useState();
    const [usuarioId, setUsuarioId] = useState(params.route.params.usuarioId);
    const [estadoId, setEstadoId] = useState();
    const [cidadeId, setCidadeId] = useState();
    const [cep, setCep] = useState();
    const [bairro, setBairro] = useState();
    const [numero, setNumero] = useState();
    const [rua, setRua] = useState();
    const [complemento, setComplemento] = useState();
    const [referencia, setReferencia] = useState();

    const [estados, setEstados] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState();
    const [selectedEstadoId, setSelectedEstadoId] = useState();

    const [cidades, setCidades] = useState([]);
    const [selectedCidade, setSelectedCidade] = useState();

    const [enderecos, setEnderecos] = useState([]);

    const carregaEnderecos = async () => {
        const response = await api.post("/endereco/lista-enderecos-usuario", { usuarioId: informacoes.usuarioId });
        setEnderecos(response.data.content);
    }
    const carregaEstados = async () => {
        const response = await api.post("/estado/lista-estado");
        setEstados(response.data.content);
    }
    const carregaCidades = async (id) => {
        const response = await api.post("/cidade/estado-id", { estadoId: id });
        setCidades(response.data.content);
    }

    const salvaEndereco = async () => {
        if (destinatario !== null, usuarioId !== null,
            cep !== null, estadoId !== null,
            cidadeId !== null, bairro !== null,
            numero !== null, rua !== null,
            complemento !== null, referencia !== null) {

            const response = await api.post("/endereco", {
                destinatario: destinatario,
                usuarioId: usuarioId,
                cep: cep,
                estadoId: estadoId,
                cidadeId: cidadeId,
                bairro: bairro,
                numero: numero,
                rua: rua,
                complemento: complemento,
                referencia: referencia
            });
            Alert.alert("Muito bem!", "Endereço salvo com sucesso!");

            setDestinatario();
            setUsuarioId();
            setCep();
            setEstadoId();
            setCidadeId();
            setBairro();
            setNumero();
            setRua();
            setComplemento();
            setReferencia();

            carregaEnderecos();
            setModalVisible(false);

        } else {
            Alert.alert("Ops!", "Preencha todos os campos!");
        }
    }

    useEffect(() => {
        carregaEnderecos();
        carregaEstados();
        carregaCidades(1);
    }, []);

    const excluirEndereco = async (id) => {
        const response = await api.delete("endereco/" + id);
        carregaEnderecos();
    }

    return (
        <View style={styles.container}>
            <View style={styles.cabecalho}>
                <TouchableOpacity style={styles.houseContainer}>
                </TouchableOpacity>
                <View style={styles.logoContainer}><Image resizeMode='contain' source={logo} style={styles.logoIcone} /></View>
                <View style={styles.favoritosContainer}></View>
            </View>
            <View style={styles.descricaoContainer}>
                <Text>Seus endereços cadastrados:</Text>
                <View style={styles.enderecosCart}>
                    <FlatList
                        data={enderecos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.itemCartContainer}>
                                    <View style={styles.infoEnderecoCartContainer}>
                                        <Text style={styles.nomeEnderecoText}>Recebedor: {item.destinatario}</Text>
                                        <Text style={styles.categoriaEnderecoText}>
                                            {item.rua}, número: {item.numero}, {item.complemento}
                                        </Text>
                                        <Text style={styles.categoriaEnderecoText}>{item.cep}</Text>
                                        <Text style={styles.enderecoEnderecoText}>{item.bairro}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.excluirButton} onPress={() => {
                                        Alert.alert("Excluir endereço!", "Você deseja exluir esse endereço?", [

                                            {
                                                text: 'Sim',
                                                onPress: () => {
                                                    excluirEndereco(item.id);
                                                },
                                            },
                                            {
                                                text: 'Não',
                                                onPress: () => { },
                                                style: 'cancel',
                                            },
                                            ,
                                        ]);
                                    }}>
                                        <Text style={styles.excluirText}>Excluir</Text>
                                    </TouchableOpacity>

                                </View>
                            );
                        }}
                    />
                </View>
                <View style={styles.rodapeContainer}>
                    <TouchableOpacity onPress={() => { setModalVisible(true) }} style={styles.novoEnderecoButton}>
                        <Text style={styles.novoEnderecoText}>Novo Endereço</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                transparent={true}
            >
                <View style={styles.modal}>
                    <View style={styles.descricaoContainer}>
                        <Text style={styles.enderecoTitulo}>Endereço</Text>
                        <TextInput style={styles.textInput} placeholder='Nome do destinatário*' onChangeText={(text) => setDestinatario(text)} />
                        <MaskedTextInput
                            style={styles.textInput}
                            placeholder="CEP*"
                            mask="99999-999"
                            keyboardType={"numeric"}
                            onChangeText={(text, rawText) => {
                                setCep(rawText);
                            }}
                        />
                        <TextInput style={styles.textInput} placeholder='Rua*' onChangeText={(text) => setRua(text)} />
                        <TextInput style={styles.textInput} placeholder='Número*' onChangeText={(text) => setNumero(text)} />
                        <TextInput style={styles.textInput} placeholder='Bairro' onChangeText={(text) => setBairro(text)} />
                        <TextInput style={styles.textInput} placeholder='Complemento' onChangeText={(text) => setComplemento(text)} />
                        <TextInput style={styles.textInput} placeholder='Referência' onChangeText={(text) => setReferencia(text)} />
                        <ScrollView contentContainerStyle={styles.textInput}>
                            <Picker
                                selectedValue={selectedEstado}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedEstado(itemValue);
                                    carregaCidades(itemIndex + 1);
                                    setEstadoId(itemIndex + 1);
                                }
                                }>
                                {estados.map((item, id) => (
                                    <Picker.Item key={item.id} label={item.nome} value={item.nome} />
                                ))}
                            </Picker>
                        </ScrollView>
                        <ScrollView contentContainerStyle={styles.textInput}>
                            <Picker
                                selectedValue={selectedCidade}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedCidade(itemValue);
                                    setCidadeId(itemIndex + 1);
                                }
                                }>
                                {cidades.map((item, id) => {
                                    return (
                                        <Picker.Item key={item.id} label={item.nome} value={item.nome} />
                                    );
                                })}
                            </Picker>
                        </ScrollView>

                    </View>
                    <View style={styles.rodapeContainerModal}>
                        <TouchableOpacity style={styles.salvarButton} onPress={() => salvaEndereco()}>
                            <Text style={styles.salvarText}>Salvar endereço</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
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
    enderecosCart: {
        width: '100%',
        height: '89%',
    },
    itemCartContainer: {
        flex: 1,
        paddingLeft: '3%',
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        marginBottom: '3%',
        elevation: 5,
        marginHorizontal: '3%',
        flexDirection: 'row',
        marginTop: '2%',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('screen').height * 0.16,
    },
    infoEnderecoCartContainer: {
        width: '80%',
        height: 100,
        justifyContent: 'center',
        paddingTop: '3%',
        paddingBottom: '3%',
        paddingRight: '3%',
    },
    nomeEnderecoText: {
        fontSize: Dimensions.get('window').width / 25,
        fontWeight: '500',
    },
    categoriaEnderecoText: {
        fontSize: Dimensions.get('window').width / 30,
        color: '#A0A0A0',
        fontWeight: '500',
    },
    enderecoEnderecoText: {
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
    comprarButton: {
        width: '50%',
        height: '80%',
        backgroundColor: '#FDB981',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    novoEnderecoButton: {
        width: '30%',
        height: '80%',
        backgroundColor: '#FDB981',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    comprarText: {
        fontSize: Dimensions.get('window').width / 20,
        color: 'white',
        fontWeight: '500',
    },
    novoEnderecoText: {
        fontSize: Dimensions.get('window').width / 28,
        color: 'white',
        fontWeight: '500',
    },
    enderecoTotal: {
        fontSize: Dimensions.get('window').width / 20,
        fontWeight: 'bold',
    },
    enderecoTotalContainer: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
    },
    total: {
        fontSize: Dimensions.get('window').width / 25,
        fontWeight: 'bold',
        color: 'grey',
    },
    modal: {
        margin: Dimensions.get('screen').height * 0.1,
        height: Dimensions.get('screen').height * 0.70,
        width: Dimensions.get('screen').width * 0.9,
        backgroundColor: 'grey',
        alignSelf: 'center',
        borderRadius: 10,

    },
    enderecoTitulo: {
        fontSize: Dimensions.get('window').height / 30,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    textInput: {
        width: '85%',
        height: Dimensions.get('window').height / 20,
        backgroundColor: "#FFFFFF",
        marginTop: '3%',
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: '6%',
        paddingRight: '5%',
        elevation: 5,
    },
    rodapeContainerModal: {
        width: '100%',
        height: '10%',
        alignItems: 'center',
    },
    salvarButton: {
        width: '40%',
        height: '60%',
        backgroundColor: '#FDB981',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    salvarText: {
        fontSize: Dimensions.get('window').width / 25,
        color: 'white',
        fontWeight: '500',
    },
    areaPicker: {
        width: '85%',
        height: Dimensions.get('window').height / 20,
        backgroundColor: "#FFFFFF",
        marginTop: '3%',
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: '6%',
        paddingRight: '5%',
        elevation: 5,
    },
    excluirButton: {
        backgroundColor: 'red',
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    excluirText: {
        fontWeight: 'bold',
        color: 'white',
    },

});
