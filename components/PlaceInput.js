import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import _ from 'lodash';

const PlaceInput = ({location, showDirectionsOnMap}) => {
  const [inputvalue, setInputvalue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [destnation, setDestination] = useState('');
  const getPlaces = async input => {
    setInputvalue(input);
    const {userLatitude, userLongitude} = location;
    let response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${userLatitude}, ${userLongitude}&radius=2&key=AIzaSyDxmp-CgMyFYe-JQo2-Y6yPVKZd9eRSAAo`,
    );
    let json = await response.json();
    setPredictions(json.predictions);
  };

  const updateDestinations = prediction => {
    const {id, structured_formatting, place_id} = prediction;
    setPredictions([]);
    setDestination(structured_formatting.main_text);
    showDirectionsOnMap(place_id);
    Keyboard.dismiss();
  };

  const predictedPlaces = predictions.map(prediction => {
    const {id, structured_formatting, place_id} = prediction;
    return (
      <TouchableOpacity
        key={id}
        onPress={preduction => updateDestinations(prediction)}>
        <View style={styles.suggestionStyle} key={id}>
          <Text style={styles.primaryText}>
            {structured_formatting.main_text}
          </Text>
          <Text style={styles.secondaryTextStyle}>
            {structured_formatting.secondary_text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  const debouncedGetPlaces = _.debounce(getPlaces, 1000);
  return (
    <View>
      <TextInput
        value={destnation}
        onChangeText={text => {
          setDestination(text);
          debouncedGetPlaces(text);
        }}
        placeholder="Where to?"
        style={styles.placeInputStyle}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {predictedPlaces}
    </View>
  );
};

export default PlaceInput;

const styles = StyleSheet.create({
  placeInputStyle: {
    height: 40,
    backgroundColor: 'white',
    marginTop: 50,
    padding: 5,
  },

  suggestionStyle: {
    borderTopWidth: 0.5,
    padding: 15,
    backgroundColor: 'white',
    borderColor: '#777',
  },

  primaryText: {
    color: 'black',
  },

  secondaryTextStyle: {
    color: '#777',
  },
});
