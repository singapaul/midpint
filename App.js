import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import PlaceInput from './components/PlaceInput';
import Geolocation from '@react-native-community/geolocation';
import PolyLine from '@mapbox/polyline';
import MapView, {Polyline, Marker} from 'react-native-maps';

const App = () => {
  const [hasMapPermissions, setHasMapPermissions] = useState(false);
  const [location, setLocation] = useState({userLatitude: 0, userLongitude: 0});
  const [destCords, setDestCords] = useState('');
  const mapRef = useRef(null);

  const getGeolocation = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setLocation({
          userLatitude: pos.coords.latitude,
          userLongitude: pos.coords.longitude,
        });
      },
      err => console.warn(err),
      {enableHighAccuracy: true},
    );
  };

  let polyline = null;
  let marker = null;
  if (destCords.length > 0) {
    polyline = (
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
    );
    marker = <Marker coordinate={destCords[destCords.length - 1]} />;
  }

  // const polyline =
  //   destCords.length > 0 ? (
  //     <Polyline
  //       coordinates={destCords}
  //       strokeColor="#000"
  //       strokeColors={[
  //         '#7F0000',
  //         '#00000000',
  //         '#B24112',
  //         '#E5845C',
  //         '#238C23',
  //         '#7F0000',
  //       ]}
  //       strokeWidth={6}
  //     />
  //   ) : null;

  async function showDirectionsOnMap(placeId) {
    const {userLatitude, userLongitude} = location;
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=place_id:${placeId}&key=AIzaSyDxmp-CgMyFYe-JQo2-Y6yPVKZd9eRSAAo`,
      );
      let json = await response.json();
      const points = PolyLine.decode(json.routes[0].overview_polyline.points);
      const LatLng = points.map(point => {
        return {latitude: point[0], longitude: point[1]};
      });
      setDestCords(LatLng);
      mapRef.current.fitToCoordinates(LatLng, {
        edgePadding: {top: 40, bottom: 40, left: 40, right: 40},
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getGeolocation();
    requestFineLocation();
  }, []);

  const requestFineLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log(granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasMapPermissions(true);
        } else {
          setHasMapPermissions(true);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return hasMapPermissions ? (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.containerMap}>
          <MapView
            ref={mapRef}
            showsUserLocation
            followsUserLocation
            style={styles.map}
            region={{
              latitude: location.userLatitude,
              longitude: location.userLongitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            {polyline}
            {marker}
          </MapView>
        </View>
        <PlaceInput
          location={location}
          showDirectionsOnMap={showDirectionsOnMap}
        />
      </View>
    </TouchableWithoutFeedback>
  ) : null;
};

export default App;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  containerMap: {
    ...StyleSheet.absoluteFillObject,
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
