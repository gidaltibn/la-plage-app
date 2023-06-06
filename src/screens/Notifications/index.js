import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import logo from '../../assets/icons/logo.png';
import construcao from '../../assets/images/construcao.png';

export default function Notifications() {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image resizeMode='contain' source={logo} style={styles.logoIcone} />
            </View>
            <Text style={styles.texto}>Desculpe, mas esta funcionalidade está em desenvolvimento!</Text>
            <Text style={styles.texto}>Em breve você terá novidades aqui!</Text>
            <View style={styles.imagemContainer}>
                <Image resizeMode='stretch' source={construcao} style={styles.imagem} />
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
        justifyContent: 'center',
    },
    logoContainer: {
        width: "45%",
        height: "20%",
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagemContainer: {
        width: "100%",
        height: "50%",
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoIcone: {
        width: "100%",
        height: "100%",
        tintColor: '#FDB981',
    },
    imagem: {
        width: "100%",
        height: "100%",
    },
    texto: {
        alignSelf: 'center',
        fontSize: Dimensions.get('screen').width / 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});