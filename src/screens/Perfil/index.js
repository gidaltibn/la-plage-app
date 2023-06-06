import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert, Image, FlatList, Button } from "react-native";
import api from "../../services/api";
import { Modal } from "react-native-paper";
import { MaskedTextInput } from 'react-native-mask-text';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function Perfil(params) {

    const [ativacaoCampos, setAtivacaoCampos] = useState(false);

    const [loading, setLoading] = useState(true);
    const [fotosExibir, setFotosExibir] = useState([]);
    const [fotosSalvar, setFotosSalvar] = useState([]);
    const [identificadores, setIdentificadores] = useState([]);

    const [id, setId] = useState(usuario?.id);
    const [nome, setNome] = useState(usuario?.nome);
    const [email, setEmail] = useState(usuario?.email);
    const [celular, setCelular] = useState(usuario?.celular);
    const [dataNascimento, setDataNascimento] = useState(usuario?.dataNascimento);
    const [perguntaSecreta, setPerguntaSecreta] = useState(usuario?.perguntaSecreta);
    const [respostaSecreta, setRespostaSecreta] = useState(usuario?.respostaPerguntaSecreta);
    const [password, setPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [repeteNewPassword, setRepeteNewPassword] = useState();

    const [usuario, setUsuario] = useState();

    const [dataFormatada, setDataFormatada] = useState();
    const [dataNascimentoFormatada, setDataNascimentoFormatada] = useState();


    const carregaImagens = async () => {
        const resultado = await api.post("/foto-perfil/usuario-id", { usuarioId: params.route.params?.id });
        setFotosExibir(resultado.data);
    }

    const carregaUsuario = async () => {
        const resultado = await api.post("/usuario/id", { id: params.route.params?.id });
        await setUsuario(resultado.data);
        await console.log(resultado.data);
        setId(resultado.data.id);
        setDataFormatada(formatDate(new Date(resultado.data.createdAt)));
        setDataNascimentoFormatada(formatDate(new Date(resultado.data.dataNascimento)));
        setLoading(false);
    }

    useEffect(() => {
        carregaUsuario();
        carregaImagens();
    }, []);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        const formattedDate = `${day}${month}${year}`;
        return formattedDate;
    };

    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleOKPress = async () => {
        const resposta = await api.post('usuario/verifica-senha', { email: usuario.email, password: password });
        console.log(resposta.data);
        if (resposta.data) {
            editaUsuario();
        } else {
            Alert.alert("Ops!", "A senha que você digitou está errada!");
        }
    };
    const editaUsuario = async () => {

        if (newPassword !== undefined) {

            if (newPassword === repeteNewPassword) {
                const [day, month, year] = dataNascimento.split('/');
                const date = new Date(year, month - 1, day);
                const resposta = await api.post("/usuario/editar-usuario", {
                    id: id,
                    nome: nome,
                    dataNascimento: date,
                    email: email,
                    celular: celular,
                    password: newPassword,
                    perguntaSecreta: perguntaSecreta,
                    respostaPerguntaSecreta: respostaSecreta,
                    status: true
                });
                console.log(resposta.data);
                setNewPassword(undefined);
                setRepeteNewPassword(undefined);
            } else {
                Alert.alert("Ops!", "Reveja a nova senha, não está igual nos dois campos.");
            }
        } else {
            const [day, month, year] = dataNascimento.split('/');
            const date = new Date(year, month - 1, day);
            //console.log("AQUI", date);
            const resposta = await api.post("/usuario/editar-usuario", {
                id: id,
                nome: nome,
                dataNascimento: date,
                email: email,
                celular: celular,
                perguntaSecreta: perguntaSecreta,
                respostaPerguntaSecreta: respostaSecreta,
                status: true
            });
            console.log(resposta.data);
        }

        salvarImagens();
        setPassword();
        setModalVisible(!modalVisible);

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
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            console.log(result);
            const uri = result.uri;
            const startIndex = uri.lastIndexOf('/') + 1;
            const filename = uri.substring(startIndex);

            await converteBase64(result.uri, filename);
        }
    }

    async function converteBase64(uri, filename) {
        const base64 = await ImageManipulator.manipulateAsync(uri, [
            { resize: { width: 800, height: 600 } }
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
        return idAleatorio;
    }

    const salvarImagens = async () => {

        if (fotosSalvar != undefined) {
            const response = await api.post("/foto-perfil", {
                nome: fotosSalvar.nome,
                urlImagem: fotosSalvar.urlImagem,
                usuarioId: usuario.id
            });
            console.log(response.data);
            Alert.alert("Processo concluído", "Alterações salvas com sucesso!");
        }
    }

    if (loading) {
        return (
            <View>
                <Text>CARREGANDO</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>

                <View style={styles.tituloContainer}>
                    <Text style={styles.tituloText}>Detalhes do Usuario</Text>
                </View>
                <Image source={fotosExibir.urlImagem !== '' ? { uri: fotosExibir.urlImagem } : null} style={styles.foto} />

                <ScrollView contentContainerStyle={styles.containerScroll} scrollEnabled={true}>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Nome:</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={ativacaoCampos}
                            value={usuario.nome}
                        />
                    </View>

                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>CPF:</Text>
                        <MaskedTextInput
                            style={styles.textInput}
                            value={usuario.cpf}
                            editable={false}
                            mask="999.999.999-99"
                            keyboardType={"numeric"}
                            onChangeText={(text, rawText) => {
                                console.log(text);
                            }}
                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Data de Nascimento:</Text>
                        <MaskedTextInput
                            style={styles.textInput}
                            value={dataNascimentoFormatada}
                            editable={ativacaoCampos}
                            mask="99/99/9999"
                            keyboardType={"numeric"}
                            onChangeText={(text, rawText) => {
                                setDataNascimento(text);
                            }}
                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>E-mail:</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={ativacaoCampos}
                            value={usuario.email}
                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Celular:</Text>
                        <MaskedTextInput
                            style={styles.textInput}
                            value={usuario.celular}
                            editable={ativacaoCampos}
                            mask="(99)99999-9999"
                            keyboardType={"numeric"}
                            onChangeText={(text, rawText) => {
                                setCelular(rawText);
                            }}
                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Alterar Senha</Text>
                        <Text style={styles.textoDescricaoCampo}>Senha atual:</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={ativacaoCampos}
                            onChangeText={(texto) => setPassword(texto)}
                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Nova senha:</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={ativacaoCampos}
                            onChangeText={(texto) => setNewPassword(texto)}

                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Repetir nova senha:</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={ativacaoCampos}
                            onChangeText={(texto) => setRepeteNewPassword(texto)}
                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Pergunta Secreta:</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={ativacaoCampos}
                            value={usuario.perguntaSecreta}
                        />
                    </View>
                    <View style={styles.campoContainer}>
                        <Text style={styles.textoDescricaoCampo}>Resposta da pergunta secreta:</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={ativacaoCampos}
                        />
                    </View>

                    <View style={styles.botoesContainer}>
                        <TouchableOpacity
                            style={styles.botao}
                            onPress={() => {
                                setAtivacaoCampos(!ativacaoCampos);
                            }}
                        >
                            <Text style={styles.textoBotao}>
                                {ativacaoCampos ? "Ok" : "Editar"}
                            </Text>
                        </TouchableOpacity>
                        {ativacaoCampos && (
                            <TouchableOpacity
                                style={styles.botao}
                                onPress={() => openGallery()}
                            >
                                <Text style={styles.textoBotao}>Adicionar Foto</Text>
                            </TouchableOpacity>
                        )}

                        {ativacaoCampos && (
                            <TouchableOpacity
                                style={styles.botao}
                                onPress={() => {
                                    setModalVisible(true);
                                    //excluirImagem();
                                }}
                            >
                                <Text style={styles.textoBotao}>Salvar Alterações</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </ScrollView>
                <Modal visible={modalVisible} style={styles.modalContainer} onDismiss={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text>Digite sua senha para confirmar as mudanças!</Text>
                        <TextInput
                            placeholder="Digite sua senha"
                            secureTextEntry
                            onChangeText={text => setPassword(text)}
                            value={password}
                            style={styles.input}
                        />

                        <View style={styles.buttonContainer}>
                            <Button title="Cancelar" onPress={toggleModal} />
                            <Button title="OK" onPress={handleOKPress} />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
    },
    tituloContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 10,
        alignItems: 'center',
    },
    tituloText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    containerScroll: {
        padding: 20,
    },
    campoContainer: {
        marginBottom: 20,
    },
    textoDescricaoCampo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInput: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    textInputDescricao: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        height: 100,
        textAlign: 'justify',
    },
    foto: {
        width: Dimensions.get('screen').width * 0.3,
        aspectRatio: 1,
        borderRadius: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignSelf: 'center',
        marginTop: '3%',
    },
    botaoAdicionar: {
        marginTop: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
        height: Dimensions.get("screen").height * 0.03,
        width: Dimensions.get("screen").width * 0.2,
        justifyContent: 'center',
        marginRight: '5%',
        alignSelf: 'flex-end'
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
    botao: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
    },
    botaoRemoverUsuario: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    textoBotao: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botaoExcluirDesativado: {
        opacity: 0.5,
    },
    botaoExcluir: {
        marginTop: 5,
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    textoBotaoExcluir: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: Dimensions.get('screen').width * 0.6,
        height: Dimensions.get('screen').height * 0.25,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 4,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
});