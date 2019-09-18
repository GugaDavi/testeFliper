import React from 'react';
import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

export default function Repository({ navigation }) {
  const url = navigation.getParam('url');

  return <WebView source={{ uri: url }} style={{ flex: 1 }} />;
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('url'),
});

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
