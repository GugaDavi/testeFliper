import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default function User({ navigation }) {
  const [repos, setRepos] = useState([]);
  const [user] = useState(navigation.getParam('user'));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadInfos() {
      setLoading(true);

      const { data } = await api.get(`/users/${user.login}/repos`);

      setRepos(data);
      setLoading(false);
    }

    loadInfos();
  }, []);

  async function loadMore() {
    const { data } = await api.get(`/users/${user.login}/starred?page=${page}`);

    setRepos([...repos, ...data]);
    setPage(page + 1);
  }

  async function refreshList() {
    setPage(1);
    setRefreshing(true);

    const { data } = await api.get(`/users/${user.login}/repos`);

    setRepos(data);
    setRefreshing(false);
  }

  async function handleNavigate(url) {
    navigation.navigate('Repository', { url });
  }

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {loading ? (
        <ActivityIndicator color="#2E8874" />
      ) : (
        <Stars
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
          onRefresh={refreshList}
          refreshing={refreshing}
          data={repos}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title onPress={() => handleNavigate(item.html_url)}>
                  {item.name}
                </Title>
                <Author>
                  {item.description ? item.description : 'Sem Descrição '}
                </Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
};
