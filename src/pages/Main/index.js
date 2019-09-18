import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  ButtonExlcude,
  Exclude,
} from './styles';

export default function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const usersAsyncStorage = await AsyncStorage.getItem('users');

      if (usersAsyncStorage) {
        setUsers(JSON.parse(usersAsyncStorage));
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    async function updateUsers() {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }

    updateUsers();
  }, [users]);

  async function handleAddUser() {
    setLoading(true);

    try {
      const response = await api.get(`/users/${newUser}`);

      setLoading(false);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      setUsers([...users, data]);
      setNewUser('');
      setLoading(false);
    } catch (error) {
      Alert.alert(
        'Usuario não encontrado',
        'Verifique os dados e tente novamente'
      );
      setLoading(false);
    }

    Keyboard.dismiss();
  }

  function handleNavigate(user) {
    navigation.navigate('User', { user });
  }

  async function handleExcludeUser(user) {
    const allUsers = users.filter(item => item.login !== user.login);

    setUsers(allUsers);
  }

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar Usúario"
          value={newUser}
          onChangeText={setNewUser}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <ButtonExlcude onPress={() => handleExcludeUser(item)}>
              <Exclude>x</Exclude>
            </ButtonExlcude>
            <Avatar source={{ uri: item.avatar }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Usuarios',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
