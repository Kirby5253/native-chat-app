import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

//Defines img path for background
const image = require('../assets/startBackgroundImage.png');

//The apps starting component which renders an input where users set a name and them for their profile
export default class Start extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			background: ''
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<ImageBackground source={image} style={styles.image}>
					<Text style={styles.header}>Kirby's Chat App</Text>
					<View style={styles.container2}>
						<TextInput
							style={styles.nameInputField}
							placeholder="Your Name"
							onChangeText={(name) => this.setState({ name })}
							value={this.state.name}
						/>
						<View style={styles.colorPickContainer}>
							<Text style={styles.chooseColor}>Choose Background Color:</Text>
							<View style={styles.colorContainer}>
								<TouchableOpacity onPress={() => this.setState({ background: '#090C08' })}>
									<View style={styles.colorBubbles} />
								</TouchableOpacity>

								<TouchableOpacity onPress={() => this.setState({ background: '#474056' })}>
									<View style={[ styles.colorBubbles, styles.colorBubbles2 ]} />
								</TouchableOpacity>

								<TouchableOpacity onPress={() => this.setState({ background: '#8A95A5' })}>
									<View style={[ styles.colorBubbles, styles.colorBubbles3 ]} />
								</TouchableOpacity>

								<TouchableOpacity onPress={() => this.setState({ background: '#B9C6AE' })}>
									<View style={[ styles.colorBubbles, styles.colorBubbles4 ]} />
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.chatButton}>
							<Button
								color="#757083"
								title="Start Chatting"
								onPress={() =>
									this.props.navigation.navigate('Chat', {
										name: this.state.name,
										background: this.state.background
									})}
							/>
						</View>
					</View>
				</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container2: {
		backgroundColor: 'white',
		height: '44%',
		width: '88%',
		position: 'absolute',
		bottom: 40,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	colorPickContainer: {
		width: '88%'
	},
	header: {
		fontSize: 45,
		fontWeight: '700',
		position: 'absolute',
		top: 100,
		color: '#FFFFFF'
	},
	chooseColor: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		alignSelf: 'flex-start',
		marginBottom: 10
	},
	nameInputField: {
		width: '88%',
		borderColor: 'grey',
		borderWidth: 2,
		padding: 5,
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 50
	},
	chatButton: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		backgroundColor: '#757083',
		width: '88%',
		marginBottom: 5,
		textTransform: 'lowercase'
	},
	colorContainer: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
		width: '80%',
		justifyContent: 'space-around'
	},
	colorBubbles: {
		position: 'relative',
		backgroundColor: '#090C08',
		width: 40,
		height: 40,
		borderRadius: 20,
		margin: 2,
		borderWidth: 0,
		borderColor: 'white'
	},
	colorBubbles2: {
		backgroundColor: '#474056'
	},
	colorBubbles3: {
		backgroundColor: '#8A95A5'
	},
	colorBubbles4: {
		backgroundColor: '#B9C6AE'
	}
});
