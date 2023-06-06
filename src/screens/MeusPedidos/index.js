import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/icons/logo.png';
import api from '../../services/api';
import { useEffect } from 'react';
import { MaskedTextInput } from 'react-native-mask-text';
import { Picker } from '@react-native-picker/picker';

export default function MeusPedidos(params) {
    //console.log(params.route.params);
    const usuario = params.route.params;
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const renderItem = ({ item }) => {
        function getMonthName(month) {
            const monthNames = [
                'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ];
            return monthNames[month];
        }

        function getWeekdayName(weekday) {
            const weekdayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            return weekdayNames[weekday];
        }

        const date = new Date(item.createdAt);
        const weekday = getWeekdayName(date.getDay());
        const month = getMonthName(date.getMonth());
        const year = date.getFullYear();
        const dateString = `${weekday}, ${date.getDate()} de ${month} de ${year}`;
        console.log(dateString);

        return (
            <View style={styles.orderContainer}>
                <Text style={styles.orderNumber}>Número do Pedido: {item.id}</Text>
                <Text style={styles.orderStatus}>Status: {item.statusDaCompra}</Text>
                <Text style={styles.estimatedDelivery}>Data do pedido: {dateString}</Text>
            </View>
        );
    };

    const carregaPedidos = async () => {
        const response = await api.post("venda/lista-usuario", { usuarioId: usuario.id });
        setOrders(response.data.content);
        setLoading(false);
    }

    useEffect(() => {
        carregaPedidos();
    }, []);

    if (loading) {
        return (
            <View>
                <Text>Carregando</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.cabecalho}>
                    <TouchableOpacity style={styles.houseContainer}>
                    </TouchableOpacity>
                    <View style={styles.logoContainer}><Image resizeMode='contain' source={logo} style={styles.logoIcone} /></View>
                    <View style={styles.favoritosContainer}></View>
                </View>
                <View>
                    <Text style={styles.title}>Acompanhamento de Pedidos</Text>

                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                    />
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listContainer: {
        flexGrow: 1,
    },
    orderContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 20,
        borderRadius: 10,
    },
    orderNumber: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    orderStatus: {},
    estimatedDelivery: {},
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
});
