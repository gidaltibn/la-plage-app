import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function VerificarLogin(params) {
    const logado = params.route.params;
    const navigation = useNavigation();
    if (logado) {
        navigation.navigate('Checkout');
    } else {
        navigation.navigate('Entrega');
    }

}