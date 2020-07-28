/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import * as Location from 'expo-location';

import styles from './styles/CustomActions.component.style';

/**
 * The apps custom action component which renders the action window and functions for chat
 * where users select a image/take picture/or send location
 * @class CustomActions
 * @requires react
 * @requires react-native
 * @requires prop-types
 * @requires expo-permissions
 * @requires expo-image-picker
 * @requires expo-location
 * @requires styles from './styles/CustomActions.component.style'
 * @requires firebase/firestore
 */
export default class CustomActions extends Component {
  /**
   * function that handles pressing the customActions button,
   * displays options [ choose image, take picture, send location, or cancel ].
   * waits for user to select option
   * @function onActionPress
   * @async
   * @return {function} runs corresponding function for each option choice
   */
  onActionPress = () => {
    const { actionSheet } = this.context;
    const options = ['Choose Image From Library', 'Take Picture', 'Send Location', 'Cancel'];

    const cancelButtonIndex = options.length - 1;
    actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        try {
          switch (buttonIndex) {
            case 0:
              console.log('user wants to pick an image');
              this.pickImage();
              return;
            case 1:
              console.log('user wants to take a photo');
              this.takePhoto();
              return;
            case 2:
              console.log('user wants to get their location');
              this.getLocation();
              return;
            default:
          }
        } catch (error) {
          console.log(error.message);
        }
      },
    );
  };

  /**
   * let user pick an image from current library/gallery, uploads to firebase storage,
   * then sends result to firestore as a url
   * @function pickImage
   * @async
   * @return {function} onSend(imageURL)
   */
  pickImage = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          // restricted to only images
          mediaTypes: 'Images',
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const { onSend } = this.props;
          const imageURL = await this.uploadImage(result.uri);
          onSend({ image: imageURL });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * let user take an image, uploads to firebase storage,
   * then sends result to firestore as a url
   * @function takePhoto
   * @async
   * @return {function} onSend(imageURL)
   */
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const { onSend } = this.props;
          const imageURL = await this.uploadImage(result.uri);
          onSend({ image: imageURL });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * handles upload to firebase storage,
   * then sends result to function
   * @function uploadImage
   * @async
   * @return {Promise<string>}
   */
  // eslint-disable-next-line consistent-return
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (error) => {
          console.error(error);
          reject(new TypeError('Network Request Failed!'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const getImageName = uri.split('/');
      const imageArrayLength = getImageName[getImageName.length - 1];
      const ref = firebase.storage().ref().child(`images/${imageArrayLength}`);

      const snapshot = await ref.put(blob);
      blob.close();
      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * lets user send current location
   * @function getLocation
   * @async
   * @return {function} onSend(location object)
   */
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({});

        if (result) {
          const { onSend } = this.props;
          onSend({
            location: {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const { wrapperStyle, iconText } = this.props;
    return (
      <TouchableOpacity
        accessibilityLabel="Click for more sharing options"
        accessibilityHint="Let’s you choose to send an image or your geolocation."
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text style={[styles.iconText, iconText]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
