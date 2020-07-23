import React from 'react';
import { View, Text } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
// Only needed if the keyboard is covering input
import KeyboardSpacer from 'react-native-keyboard-spacer';
var uuid = require('react-native-uuid');

const firebase = require('firebase');
require('firebase/firestore');

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
		this.referenceMessages = firebase.firestore().collection('messages');
		let name = this.props.route.params.name;

		this.state = {
			messages: []
		};
	}

	componentDidMount() {
		let name = this.props.route.params.name;
		this.loginMessage(name);

		// listen to authentication events
		this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
			if (!user) {
				await firebase.auth().signInAnonymously().catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorCode, errorMessage);
				});
			}
			//update user state with currently active user data
			this.setState({
				uid: user.uid
			});

			// create a reference to the active user's documents
			this.referenceMessagesUser = firebase.firestore().collection('messages').orderBy('createdAt', 'asc');
			// listen for collection changes for current user
			this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);
		});
	}

	componentWillUnmount() {
		// stop listening to authentication
		this.authUnsubscribe;
		// stop listening for changes
		this.unsubscribeMessagesUser;
		let name = this.props.route.params.name;
		this.logoutMessage(name);
	}

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];
		// go through each doc
		querySnapshot.forEach((doc) => {
			// get the QueryDocumentSnapshot's data
			var data = doc.data();
			messages.push({
				text: data.text,
				system: data.system,
				_id: data._id,
				createdAt: data.createdAt,
				user: data.user
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
	};

	// This appends the message to the state of the chat
	onSend = (messages = []) => {
		var last_element = messages[messages.length - 1];
		this.addMessage(last_element.text);
	};

	addMessage(message) {
		this.referenceMessages.add({
			createdAt: new Date(),
			system: false,
			_id: uuid.v1(),
			text: message,
			user: {
				_id: this.state.uid,
				avatar: '',
				name: this.props.route.params.name
			}
		});
	}

	loginMessage(name) {
		this.referenceMessages.add({
			createdAt: new Date(),
			system: true,
			_id: uuid.v1(),
			text: name + ' has entered the chat'
		});
	}

	logoutMessage(name) {
		this.referenceMessages.add({
			createdAt: new Date(),
			system: true,
			_id: uuid.v1(),
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
					messages={this.state.messages}
					onSend={(messages) => this.onSend(messages)}
					user={{
						_id: this.state.uid
					}}
				/>

				{/* This currently is not necessary for the current android, it actually breaks the app */}
				{/* {Platform.OS === 'android' ? <KeyboardSpacer /> : null } */}
			</View>
		);
	}
}
