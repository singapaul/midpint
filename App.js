import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Map from './components/Map';

const App = () => {
  const [hasMapPermissions, setHasMapPermissions] = useState(true);

  

  return <View>{hasMapPermissions && <Map />}</View>;
};

export default App;

const styles = StyleSheet.create({});
