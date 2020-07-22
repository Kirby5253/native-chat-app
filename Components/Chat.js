import React from 'react';
import { View, Text } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
// Only needed if the keyboard is covering input
import KeyboardSpacer from 'react-native-keyboard-spacer';

//The apps chat component which renders a chat interface where users select a friend and chat with them
export default class Chat extends React.Component {
	state = {
		messages: []
	};

	componentDidMount() {
		let name = this.props.route.params.name;
		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello developer',
					createdAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://placeimg.com/140/140/any'
					}
				},
				{
					_id: 2,
					text: name + ` has entered the chat.`,
					createdAt: new Date(),
					system: true
				}
			]
		});
	}

	// This appends the message to the state of the chat
	onSend = (messages = []) => {
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages)
		}));
	};

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
						_id: 1
					}}
				/>

				{/* This currently is not necessary for the current android, it actually breaks the app */}
				{/* {Platform.OS === 'android' ? <KeyboardSpacer /> : null } */}
			</View>
		);
	}
}
