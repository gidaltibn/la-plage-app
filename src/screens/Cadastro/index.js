import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/icons/logo.png';
import house from '../../assets/icons/house.png';
import { MaskedTextInput } from 'react-native-mask-text';
import api from '../../services/api';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function Cadastro() {

    const [nome, setNome] = useState();
    const [cpf, setCpf] = useState();
    const [dataNascimento, setDataNascimento] = useState();
    const [email, setEmail] = useState();
    const [celular, setCelular] = useState();
    const [senha, setSenha] = useState();
    const [perguntaSecreta, setPerguntaSecreta] = useState();
    const [respostaSecreta, setRespostaSecreta] = useState();

    const [visiblePass, setVisiblePass] = useState(true);

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const [repeteSenha, setRepeteSenha] = useState();

    const [fotosExibir, setFotosExibir] = useState([]);
    const [fotosSalvar, setFotosSalvar] = useState([]);
    const [idExcluir, setIdExcluir] = useState();
    const [identificadores, setIdentificadores] = useState([]);
    const [imagensExcluir, setImagensExluir] = useState([]);
    const [buttonText, setButtonText] = useState('Visualizar senha');

    const handlePress = () => {
        setVisiblePass(!visiblePass);
        setButtonText(visiblePass ? 'Ocultar senha' : 'Visualizar senha');
    };

    const salvarFotoPerfil = async (usuarioId) => {
        console.log("CHEGOU AQUI NA FOTO.");
        const response = await api.post("/foto-perfil", {
            nome: fotosSalvar.nome,
            urlImagem: fotosSalvar.urlImagem,
            usuarioId: usuarioId
        });
        console.log(response.data);
    }

    const openGallery = async () => {
        // PERMISSÃO PARA ACESSAR A GALERIA
        const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Você não permitiu o acesso à sua galeria!");
            return;
        }
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            const uri = result.uri;
            const startIndex = uri.lastIndexOf('/') + 1;
            const filename = uri.substring(startIndex);

            await converteBase64(result.uri, filename);
        }
    }

    async function converteBase64(uri, filename) {
        const base64 = await ImageManipulator.manipulateAsync(uri, [
            { resize: { width: 800, height: 800 } }
        ], { base64: true, compress: 0.9 });
        adicionarFoto("data:image/*;base64," + base64.base64, filename);
    }

    const adicionarFoto = (uri, filename) => {
        const novoId = gerarNumeroAleatorioNaoRepetido(identificadores);
        const novaUrl = uri;
        const novaFoto = { id: novoId, urlImagem: novaUrl, nome: filename };
        setFotosSalvar(novaFoto);
        setFotosExibir(novaFoto);
    };
    const gerarNumeroAleatorioNaoRepetido = (array) => {
        const algarismosPermitidos = '0123456789';
        let idAleatorio = Array.from({ length: 2 }, () => algarismosPermitidos[Math.floor(Math.random() * algarismosPermitidos.length)]).join('');
        while (array.includes(idAleatorio)) {
            idAleatorio = Array.from({ length: 2 }, () => algarismosPermitidos[Math.floor(Math.random() * algarismosPermitidos.length)]).join('');
        }

        array.push(idAleatorio);
        setIdExcluir(idAleatorio);
        return idAleatorio;
    }
    const excluirImagem = async () => {
        console.log(imagensExcluir);
        for (let i = 0; i < imagensExcluir.length; i++) {
            const response = await api.delete("/imagem/" + imagensExcluir[i]);
            console.log(response);
        }
    }

    const salvarCliente = async () => {
        const [day, month, year] = dataNascimento.split('/');
        const date = new Date(year, month - 1, day);
        if (nome != null && cpf != null && email != null && celular != null && senha != null && repeteSenha != null && dataNascimento != null && perguntaSecreta != null && respostaSecreta != null) {
            if (senha === repeteSenha) {

                const response = await api.post("/usuario", {
                    nome: nome,
                    cpf: cpf,
                    dataNascimento: date,
                    email: email,
                    celular: celular,
                    password: senha,
                    perguntaSecreta: perguntaSecreta,
                    respostaPerguntaSecreta: respostaSecreta
                });
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    salvarFotoPerfil(response.data.id);
                    Alert.alert("Bem-vindo(a), ", response.data.nome + "!", [{ text: 'OK', onPress: () => navigation.navigate("Home", response.data) }]);
                } else if (response.status === 202) {
                    Alert.alert("Eita, ", "Vimos que você já está cadastrado, tente recuperar sua senha caso não lembre!", [{ text: 'OK', onPress: () => navigation.goBack() }]);
                }
                else {
                    Alert.alert("Ah não! :´( ", "Infelizmente tivemos uma falha, mas tente novamente daqui a pouco!", [{ text: 'OK', onPress: () => navigation.goBack() }]);
                }
            } else {
                Alert.alert("As senhas não estão iguais!", "Corrige lá!");
            }
        } else {
            console.log(nome);
            console.log(cpf);
            console.log(dataNascimento);
            console.log(email);
            console.log(senha);
            console.log(repeteSenha);
            console.log(perguntaSecreta);
            console.log(respostaSecreta);
            Alert.alert("Ei!", "Preenche todos os campos, please! :D");
        }

    };

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

                </TouchableOpacity>
            </View>
            <View style={styles.descricaoContainer}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.fotosContainer}>
                        <Image source={fotosExibir.urlImagem !== '' ? { uri: fotosExibir.urlImagem } : null} style={styles.foto} />
                        <View>
                            <TouchableOpacity
                                style={styles.botaoExcluir}
                                onPress={() => {
                                    setFotosExibir();
                                    setFotosSalvar();
                                }}
                            >
                                <Text style={styles.textoBotaoExcluir}>Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.botaoAdicionar}
                                onPress={() => openGallery()}
                            >
                                <Text style={styles.textoBotaoExcluir}>Adicionar Foto</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Nome*'
                        onChangeText={(text) => { setNome(text) }}
                    />
                    <MaskedTextInput
                        style={styles.textInput}
                        placeholder="CPF*"
                        mask="999.999.999-99"
                        keyboardType={"numeric"}
                        onChangeText={(text, rawText) => {
                            setCpf(rawText);
                        }}
                    />
                    <MaskedTextInput
                        style={styles.textInput}
                        placeholder="Data de Nascimento*"
                        mask="99/99/9999"
                        keyboardType={"numeric"}
                        onChangeText={(text, rawText) => {
                            setDataNascimento(text);
                        }}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder='E-mail*'
                        keyboardType="email-address"
                        onChangeText={(text) => { setEmail(text) }}
                    />
                    <MaskedTextInput
                        style={styles.textInput}
                        placeholder="Celular*"
                        mask="(99) 9 9999-9999"
                        keyboardType={'phone-pad'}
                        onChangeText={(text, rawText) => {
                            setCelular(rawText);
                        }}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder='Senha*'
                        onChangeText={(text) => setSenha(text)}
                        secureTextEntry={visiblePass}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder='Confirmar senha*'
                        onChangeText={(text) => setRepeteSenha(text)}
                        secureTextEntry={visiblePass}
                    />
                    <TouchableOpacity onPress={() => { handlePress() }}>
                        <Text style={styles.visualizaSenhaTexto}>
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Escreva uma pergunta secreta para recuperação de senha*'
                        onChangeText={(text) => { setPerguntaSecreta(text) }}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder='Resposta*'
                        onChangeText={(text) => { setRespostaSecreta(text) }}
                    />

                </ScrollView>
            </View>
            <View style={styles.rodapeContainer}>
                <TouchableOpacity
                    style={styles.botaoSalvar}
                    onPress={() => {
                        salvarCliente();
                    }}
                >
                    <Text>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        paddingBottom: '2%',
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    tituloContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: "5%",
        alignItems: 'center',
    },
    tituloText: {
        color: 'white',
        fontSize: Dimensions.get("screen").width / 20,
        fontWeight: 'bold',
    },
    descricaoContainer: {
        flex: 1,
        paddingBottom: '7%',
        paddingHorizontal: '5%',
        height: Dimensions.get('screen').height * 0.9,
        width: Dimensions.get('screen').width * 0.95,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    enderecoTitulo: {
        fontSize: Dimensions.get('window').height / 30,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'stretch',
    },
    textInput: {
        width: '85%',
        height: Dimensions.get('window').height / 20,
        backgroundColor: "#FFFFFF",
        marginTop: '1.5%',
        marginBottom: '1.5%',
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: '6%',
        paddingRight: '5%',
        elevation: 5,
    },
    rodapeContainer: {
        height: Dimensions.get('screen').height * 0.08,
        width: Dimensions.get('screen').width * 0.95,
        alignItems: 'center',
        alignSelf: 'center',
    },
    botaoSalvar: {
        width: Dimensions.get("screen").height * 0.2,
        height: Dimensions.get("screen").height * 0.05,
        backgroundColor: '#FDB981',
        borderRadius: 10,
        paddingLeft: '5%',
        paddingRight: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
        marginTop: '2%',
    },
    salvarText: {
        fontSize: Dimensions.get('screen').width / 25,
        marginHorizontal: 30,
        fontWeight: 'bold',
    },
    visualizaSenhaTexto: {
        color: '#007bff',
        textAlign: 'right',
        marginTop: "3%",
    },
    botao: {
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        height: Dimensions.get('screen').height * 0.1,
        width: Dimensions.get('screen').width * 0.5,
    },
    fotosContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get("screen").height * 0.2,
        width: Dimensions.get("screen").width,
    },
    foto: {
        width: Dimensions.get('screen').width * 0.4,
        aspectRatio: 1,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    botaoExcluir: {
        marginTop: 5,
        backgroundColor: 'red',
        borderRadius: 5,
        height: Dimensions.get('screen').height * 0.03,
        justifyContent: 'center',
        marginLeft: '1.5%',
    },
    botaoAdicionar: {
        marginTop: 5,
        backgroundColor: '#007bff',
        borderRadius: 5,
        height: Dimensions.get('screen').height * 0.03,
        justifyContent: 'center',
        marginLeft: '1.5%',
    },
    textoBotaoExcluir: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },

});
