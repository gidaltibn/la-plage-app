import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../../services/api';
import { Alert } from 'react-native';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function LoginModel() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const login = async () => {
        const response = await api.post('/login',{
            email: email,
            password: password
        });
        console.log(response.data);
        if (response.data!=null){
            Alert.alert("Uhuul!", "Você está logada, gata!");
        }
    }

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.textLogin}>Login</Text>
            <View>
                <TextInput style={styles.textInput} placeholder='E-mail' keyboardType="email-address" onChangeText={(text) => setEmail(text)}/>
                <TextInput style={styles.textInput} placeholder='Senha' secureTextEntry={true} onChangeText={(text) => setPassword(text)}/>
            </View>
            <View>
                <TouchableOpacity><Text style={styles.textEsqCad} >Recuperar senha</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}><Text style={styles.textEsqCad} >Criar minha conta</Text></TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.entrarButton} onPress={()=>{login();}}>
                    <Text>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
