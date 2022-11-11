import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {View, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import {Polyline} from 'react-native-maps';
import {useRef} from 'react';

const Map = ({location, destCords}) => {
  console.log('These are the maps children');
  console.log('The location: ' + location);
  console.log('The cords passed to Map are: ' + destCords);

  // const mapRef = useRef(destCords);

  // mapRef.current.fitToCoordinates(destCords);

  const polyline =
    destCords.length > 0 ? (
      <Polyline
        coordinates={destCords}
        strokeColor="#000"
        strokeColors={[
          '#7F0000',
          '#00000000',
          '#B24112',
          '#E5845C',
          '#238C23',
          '#7F0000',
        ]}
        strokeWidth={6}
      />
    ) : null;
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <MapView
          showsUserLocation
          followsUserLocation
          style={styles.map}
          fitToCoordinates={destCords}
          region={{
            latitude: location.userLatitude,
            longitude: location.userLongitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          {polyline}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    ...StyleSheet.absoluteFillObject,
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Map;
