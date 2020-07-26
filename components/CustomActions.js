import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import * as Location from 'expo-location';
import MapView from 'react-native-maps';

export default class CustomActions extends Component {
	state = {
		image: null
	};

	onActionPress = () => {
		const options = [ 'Choose Image From Library', 'Take Picture', 'Send Location', 'Cancel' ];

		const cancelButtonIndex = options.length - 1;
		this.context.actionSheet().showActionSheetWithOptions({
			options,
			cancelButtonIndex
		}, async (buttonIndex) => {
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
					default:
				}
			} catch (error) {
				console.log(error.message);
			}
		});
	};

	//let user pick an image
	pickImage = async () => {
		try {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

			if (status === 'granted') {
				let result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: 'Images'
				}).catch((error) => console.log(error));

				if (!result.cancelled) {
					const imageURL = await this.uploadImage(result.uri);
					this.props.onSend({ image: imageURL });
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	//let user take an image and send
	takePhoto = async () => {
		try {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

			if (status === 'granted') {
				let result = await ImagePicker.launchCameraAsync({
					mediaTypes: 'Images'
				}).catch((error) => console.log(error));

				if (!result.cancelled) {
					const imageURL = await this.uploadImage(result.uri);
					this.props.onSend({ image: imageURL });
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

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

	getLocation = async () => {
		try {
			const { status } = await Permissions.askAsync(Permissions.LOCATION);

			if (status === 'granted') {
				let result = await Location.getCurrentPositionAsync({});

				if (result) {
					this.props.onSend({
						location: {
							latitude: result.coords.latitude,
							longitude: result.coords.longitude
						}
					});
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	render() {
		return (
			<TouchableOpacity
				accessible={true}
				accessibilityLabel="Click for more sharing options"
				accessibilityHint="Let’s you choose to send an image or your geolocation."
				style={[ styles.container ]}
				onPress={this.onActionPress}
			>
				<View style={[ styles.wrapper, this.props.wrapperStyle ]}>
					<Text style={[ styles.iconText, this.props.iconText ]}>+</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10
	},
	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1
	},
	iconText: {
		color: '#b2b2b2',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: 'transparent',
		textAlign: 'center'
	}
});

CustomActions.contextTypes = {
	actionSheet: PropTypes.func
};
