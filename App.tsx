import React, { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from './api';

interface DataProps {
  uf: string;
  localidade: string;
  bairro: string;
  logradouro: string;
  cep: string;
  ddd: string;
}

export default function App() {
  const [cep, setCep] = useState<string>(null);
  const [data, setData] = useState<DataProps>(null);

  const getData = async () => {
    if (!cep) {
      alert('Escreva um cep válido');
      return;
    }

    if (cep.length < 8) {
      alert('Escreva um cep válido');
      setCep('');
      return;
    }

    try {
      const response: any = await api.get(`${cep}/json`);

      setData({
        uf: response.data.uf,
        localidade: response.data.localidade,
        bairro: response.data.bairro,
        logradouro: response.data.logradouro,
        cep: response.data.cep,
        ddd: response.data.ddd,
      });
    } catch (error) {
      throw new Error('Ocorreu um erro inesperado');
    } finally {
      setCep('');
    }

    if (data === null) {
      alert('Cep inválido');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.nameApp}>Consulta CEP</Text>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 57000-000"
          keyboardType="numeric"
          maxLength={8}
          value={cep}
          onChangeText={(txt) => {
            setData(null);
            setCep(txt);
          }}
        />
        <TouchableOpacity style={styles.btn} onPress={getData}>
          <Text style={styles.txtBtn}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {data && data.cep && (
          <>
            <Text>Logradouro: {data.logradouro}</Text>
            <Text>Cidade: {data.localidade}</Text>
            <Text>Estado: {data.uf}</Text>
            <Text>Cep: {data.cep}</Text>
            <Text>DDD: {data.ddd}</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  content: {
    flexDirection: 'row',
    gap: 8,
  },
  nameApp: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: 230,
    padding: 8,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 6,
  },
  btn: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 6,
  },
  txtBtn: {
    color: '#fff',
  },
  list: {
    height: 150,
    width: '80%',
    gap: 16,
    alignItems: 'flex-start',
  },
});
