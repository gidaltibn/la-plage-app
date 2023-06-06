import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import heart from '../../assets/icons/heart.png';
import logo from '../../assets/icons/logo.png';
import house from '../../assets/icons/house.png';
import { MaskedTextInput } from 'react-native-mask-text';

/*
ESQUEMAS DE CORES
QUASE BRANCO #F2EBDC
BEGE         #FDB981
LARANJA      #D95C14
MARROM       #BF784E
LARANJA+     #D94B18
*/

export default function Entrega() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
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
                <Text style={styles.enderecoTitulo}>Endereço</Text>
                <TextInput style={styles.textInput} placeholder='Nome do destinatário*' keyboardType="email-address" />
                <MaskedTextInput
                    style={styles.textInput}
                    placeholder="CEP*"
                    mask="99999-999"
                    keyboardType={"numeric"}
                    onChangeText={(text, rawText) => {
                        console.log(text);
                    }}
                />
                <TextInput style={styles.textInput} placeholder='Endereço*' keyboardType="email-address" />
                <TextInput style={styles.textInput} placeholder='Número*' keyboardType="email-address" />
                <TextInput style={styles.textInput} placeholder='Complemento' keyboardType="email-address" />
                <TextInput style={styles.textInput} placeholder='Referência' keyboardType="email-address" />
                <TextInput style={styles.textInput} placeholder='Bairro*' keyboardType="email-address" />
                <TextInput style={styles.textInput} placeholder='Cidade*' keyboardType="email-address" />
                <TextInput style={styles.textInput} placeholder='Estado*' keyboardType="email-address" />
            </View>
            <View style={styles.rodapeContainer}>
                <TouchableOpacity style={styles.salvarButton}>
                    <Text style={styles.salvarText}>Salvar endereço</Text>
                </TouchableOpacity>
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
    descricaoContainer: {
        flex: 1,
        padding: '5%',
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
    rodapeContainer: {
        width: '100%',
        height: '15%',
        alignItems: 'center',
    },
    salvarButton: {
        width: '50%',
        height: '80%',
        backgroundColor: '#FDB981',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    salvarText: {
        fontSize: Dimensions.get('window').width / 20,
        color: 'white',
        fontWeight: '500',
    },

});
