import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import heart from '../../assets/icons/heart.png';
import logo from '../../assets/icons/logo.png';
import house from '../../assets/icons/house.png';
import LoginModel from '../../components/Cards/LoginModel';
import api from '../../services/api';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function Auth(params) {
    console.log(params.route.params);

    const proximaTela = params.route.params.tipoTela;
    const produto = params.route.params.produto;

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState();

    const limparFilaTelas = () => {
        navigation.dispatch(StackActions.popToTop());
    }

    const login = async () => {
        try {
            const response = await api.post("login", {
                email: email,
                password: password
            });
            
            console.log(response.data.data);
            navigation.navigate("HomeAuth", response.data.data);

        } catch (error) {
            if (error.response) {
                // Erro de resposta da API (status code diferente de 2xx)
                console.log("Erro no login 1:", error.response.data);
                Alert.alert("Erro no login:", ""+error.response.data.error+", verifique e-mail e senha inseridos.");
            } else if (error.request) {
                // Nenhuma resposta foi recebida do servidor
                console.log("Erro no login: Nenhuma resposta do servidor");
                Alert.alert("Erro no login:", "Nenhuma resposta do servidor");
            } else {
                // Erro ao realizar a requisição
                console.log("Erro no login: 2", error.message);
                Alert.alert("Erro no login: 3", ""+error.message);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.cabecalho}>
                <TouchableOpacity style={styles.houseContainer} onPress={() => login()}>
                    <Image resizeMode='contain' source={house} style={styles.houseIcone} />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <Image resizeMode='contain' source={logo} style={styles.logoIcone} />
                </View>
                <View style={styles.favoritosContainer}>
                </View>
            </View>
            <View style={styles.descricaoContainer}>
                <View style={styles.loginContainer}>
                    <Text style={styles.textLogin}>Login</Text>
                    <View>
                        <TextInput style={styles.textInput} placeholder='E-mail' keyboardType="email-address" onChangeText={(text) => {setEmail(text);}} />
                        <TextInput style={styles.textInput} placeholder='Senha' secureTextEntry={true} onChangeText={(text) => {setPassword(text);}} />
                    </View>
                    <View>
                        <TouchableOpacity><Text style={styles.textEsqCad} >Recuperar senha</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}><Text style={styles.textEsqCad} >Criar minha conta</Text></TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.entrarButton} onPress={() => { login(); }}>
                            <Text>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    descricaoContainer: {
        flex: 1,
        padding: '5%',
        width: "90%",
        alignSelf: 'center',
    },
    loginContainer: {
        flex: 1,
        paddingTop: '2%',
        paddingBottom: '2%',
        borderRadius: 10,
        justifyContent: 'center',
    },
    textLogin: {
        fontSize: Dimensions.get('window').width / 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    textInput: {
        width: '85%',
        height: Dimensions.get('window').height / 20,
        backgroundColor: "#FFFFFF",
        marginTop: '7%',
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: '6%',
        paddingRight: '5%',
        elevation: 5,
    },
    textEsqCad: {
        alignSelf: 'center',
        color: 'grey',
        fontWeight: 'bold',
        fontStyle: 'italic',
        margin: '2%',
    },
    entrarButton: {
        width: '80%',
        height: '30%',
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

});
