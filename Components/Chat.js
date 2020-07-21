import React from 'react';
import { View, Text } from 'react-native';

//The apps chat component which renders a chat interface where users select a friend and chat with them
export default class Chat extends React.Component {
	render() {
		let name = this.props.route.params.name;
		let background = this.props.route.params.background;

		//Set the name on the navigation bar
		this.props.navigation.setOptions({ title: name });

		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: background
				}}
			>
				<Text style={{ color: '#fff' }}>Hello {name}!</Text>
			</View>
		);
	}
}
