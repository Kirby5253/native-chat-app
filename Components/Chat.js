import React from 'react';
import { View, YellowBox, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
// Only needed if the keyboard is covering input
import KeyboardSpacer from 'react-native-keyboard-spacer';
import CustomActions from './CustomActions';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

const firebase = require('firebase');
require('firebase/firestore');

import _ from 'lodash';

import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

YellowBox.ignoreWarnings([ 'Warning: ...' ]);
const _console = _.clone(console);
console.warn = (message) => {
	if (message.indexOf('Setting a timer') <= -1) {
		_console.warn(message);
	}
};

//The apps chat component which renders a chat interface where users select a friend and chat with them
export default class Chat extends React.Component {
	constructor(props) {
		super(props);

		// Configures connection to firebase
		if (!firebase.apps.length) {
			firebase.initializeApp({
				apiKey: 'AIzaSyCxNGedeO5HZ6X3pNhyprBMRGQyIOEYEWs',
				authDomain: 'react-native-chat-app-f4288.firebaseapp.com',
				databaseURL: 'https://react-native-chat-app-f4288.firebaseio.com',
				projectId: 'react-native-chat-app-f4288',
				storageBucket: 'react-native-chat-app-f4288.appspot.com',
				messagingSenderId: '732125871625'
			});
		}

		// creates reference to messages collection in DB
		this.referenceMessages = firebase.firestore().collection('messagesNew');

		this.state = {
			messages: []
		};
	}

	randomizeId() {
		let randomNumber = Math.floor(Math.random() * 1000000000000000000);
		this.setState({
			randomId: randomNumber
		});
	}

	componentDidMount() {
		this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
			this.handleConnectivityChange(state);
		});

		// Determines if user is online
		NetInfo.fetch().then((state) => {
			const isConnected = state.isConnected;
			if (isConnected) {
				console.log('online');
				this.setState({
					isConnected: true
				});

				// when component mounts, a system message is sent to the chat
				let name = this.props.route.params.name;
				this.loginMessage(name);

				// listen to authentication events
				this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
					if (!user) {
						await firebase.auth().signInAnonymously();
					} else {
						//update user state with currently active user data
						this.setState({
							uid: user.uid
						});
					}

					// create a reference to the active user's documents
					this.referenceMessagesUser = firebase
						.firestore()
						.collection('messagesNew')
						.orderBy('createdAt', 'asc');
					// listen for collection changes for current user
					this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);
				});
			} else {
				console.log('offline');
				this.setState({
					isConnected: false
				});
				// Retrieves messages from cache
				this.getMessages();
			}
		});
	}

	componentWillUnmount() {
		// this.logoutMessage(this.props.route.params.name);
		// stop listening to authentication
		this.authUnsubscribe;
		// stop listening for changes
		this.unsubscribeMessagesUser;
		this.unsubscribeNetInfo;
	}

	async getMessages() {
		let messages = '';
		try {
			messages = (await AsyncStorage.getItem('messages')) || [];
			this.setState({
				messages: JSON.parse(messages)
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	async saveMessages() {
		try {
			await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
		} catch (error) {
			console.log(error.message);
		}
	}

	async deleteMessages() {
		try {
			await AsyncStorage.removeItem('messages');
		} catch (error) {
			console.log(error.message);
		}
	}

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// go through each doc
		querySnapshot.forEach((doc) => {
			// get the QueryDocumentSnapshot's data
			var data = doc.data();
			messages.push({
				text: data.text.toString(),
				system: data.system,
				_id: data._id,
				createdAt: data.createdAt,
				user: data.user,
				image: data.image || '',
				location: data.location
			});
		});
		messages.sort((a, b) => {
			if (a.createdAt < b.createdAt) {
				return 1;
			} else {
				return -1;
			}
		});
		this.setState({
			messages
		});
		this.saveMessages();
	};

	handleConnectivityChange = (state) => {
		const isConnected = state.isConnected;

		if (isConnected == true) {
			console.log('online');
			this.setState({
				isConnected: true
			});
			this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
				if (!user) {
					await firebase.auth().signInAnonymously();
				} else {
					//update user state with currently active user data
					this.setState({
						uid: user.uid
					});
				}
			});
		} else {
			this.setState({
				isConnected: false
			});
			console.log('offline');
			this.getMessages();
		}
	};

	// This appends the message to the state of the chat
	onSend = (messages = []) => {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages)
			}),
			() => {
				this.addMessage();
				this.saveMessages();
			}
		);
	};

	addMessage() {
		const message = this.state.messages[0];

		this.referenceMessages.add({
			_id: message._id,
			text: message.text || '',
			createdAt: Date.parse(message.createdAt),
			user: message.user,
			image: message.image || '',
			location: message.location || null,
			sent: true
		});
	}

	// Sends system message that the user has entecred the chat
	loginMessage(name) {
		let randomNumber = Math.floor(Math.random() * 1000000000000000000);
		this.referenceMessages.add({
			createdAt: Date.parse(new Date()),
			system: true,
			_id: randomNumber,
			text: name + ' has entered the chat'
		});
	}

	// Sends system message that the user has left the chat
	logoutMessage(name) {
		let randomNumber = Math.floor(Math.random() * 1000000000000000000);
		this.referenceMessages.add({
			createdAt: Date.parse(new Date()),
			system: true,
			_id: randomNumber,
			text: name + ' has left the chat'
		});
	}

	// Allows customization of chat bubble color
	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#000'
					}
				}}
			/>
		);
	}

	// Customize blue send button to correct text style change
	renderSend(props) {
		return <Send {...props} textStyle={{ color: '#0a84fa' }} label={'Send'} />;
	}

	renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
			return <InputToolbar {...props} />;
		}
	}

	renderCustomActions(props) {
		return <CustomActions {...props} />;
	}

	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{
						width: 150,
						height: 100,
						borderRadius: 13,
						margin: 3
					}}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					}}
				/>
			);
		}
		return null;
	}

	render() {
		let name = this.props.route.params.name;
		let background = this.props.route.params.background;

		//Set the name on the navigation bar
		this.props.navigation.setOptions({ title: name });

		return (
			<View
				style={{
					flex: 1,
					backgroundColor: background
				}}
			>
				<GiftedChat
					// Allows for black message text for the light background option
					textStyle={
						background === '#B9C6AE' || background === '#8A95A5' ? { color: 'black' } : { color: '#CFD1D2' }
					}
					// Changes color of the bubble
					// renderBubble={this.renderBubble.bind(this)}
					renderSend={this.renderSend.bind(this)}
					renderInputToolbar={this.renderInputToolbar.bind(this)}
					renderActions={this.renderCustomActions}
					renderCustomView={this.renderCustomView}
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: this.state.uid,
						name,
						avatar: ''
					}}
				/>

				{/* This currently is not necessary for the current android, it actually breaks the app */}
				{/* {Platform.OS === 'android' ? <KeyboardSpacer /> : null } */}
			</View>
		);
	}
}
