import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView } from 'react-native';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import the screens we want to navigate
import Start from './Components/Start';
import Chat from './Components/Chat';

const Stack = createStackNavigator();

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Start">
					<Stack.Screen options={{ headerShown: false }} name="Start" component={Start} />
					<Stack.Screen name="Chat" component={Chat} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

const styles = StyleSheet.create({});
