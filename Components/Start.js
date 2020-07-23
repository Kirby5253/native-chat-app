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
			background: '#090C08'
		};
	}

	render() {
		return (
			<View style={styles.container}>
				{/* Sets the background for the app */}
				<ImageBackground source={image} style={styles.image}>
					{/* App Title */}
					<Text style={styles.header}>Kirby's Chat App</Text>

					{/* Main interactive section of start page  */}
					<View style={styles.container2}>
						{/* Allow users to enter their name */}
						<TextInput
							style={styles.nameInputField}
							placeholder="Your Name"
							onChangeText={(name) => this.setState({ name })}
							value={this.state.name}
						/>

						{/* Grouping of the color selection section */}
						<View style={styles.colorPickContainer}>
							<Text style={styles.chooseColor}>Choose Background Color:</Text>

							{/* Contains the color bubbles */}
							<View style={styles.colorContainer}>
								{/* First color bubble selector */}
								<View
									style={[
										styles.colorBubbles1,
										this.state.background === '#090C08'
											? styles.colorBubblesRing
											: styles.colorBubblesNotActive
									]}
								>
									<TouchableOpacity onPress={() => this.setState({ background: '#090C08' })}>
										<View style={[ styles.colorBubbles, styles.colorBubbles1 ]} />
									</TouchableOpacity>
								</View>

								{/* Second color bubble selector */}
								<View
									style={[
										styles.colorBubbles2,
										this.state.background === '#474056'
											? styles.colorBubblesRing
											: styles.colorBubblesNotActive
									]}
								>
									<TouchableOpacity onPress={() => this.setState({ background: '#474056' })}>
										<View style={[ styles.colorBubbles, styles.colorBubbles2 ]} />
									</TouchableOpacity>
								</View>

								{/*Third color bubble selector */}
								<View
									style={[
										styles.colorBubbles3,
										this.state.background === '#8A95A5'
											? styles.colorBubblesRing
											: styles.colorBubblesNotActive
									]}
								>
									<TouchableOpacity onPress={() => this.setState({ background: '#8A95A5' })}>
										<View style={[ styles.colorBubbles, styles.colorBubbles3 ]} />
									</TouchableOpacity>
								</View>

								{/*Fourth color bubble selector */}
								<View
									style={[
										styles.colorBubbles4,
										this.state.background === '#B9C6AE'
											? styles.colorBubblesRing
											: styles.colorBubblesNotActive
									]}
								>
									<TouchableOpacity onPress={() => this.setState({ background: '#B9C6AE' })}>
										<View style={[ styles.colorBubbles, styles.colorBubbles4 ]} />
									</TouchableOpacity>
								</View>
							</View>
						</View>

						{/* Start the chat button */}
						<TouchableOpacity
							style={styles.chatButton}
							onPress={() =>
								this.props.navigation.navigate('Chat', {
									name: this.state.name,
									background: this.state.background
								})}
						>
							<Text style={styles.chatButtonText}>Start Chatting</Text>
						</TouchableOpacity>
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
	// format for app title
	header: {
		fontSize: 45,
		fontWeight: '700',
		position: 'absolute',
		top: 100,
		color: '#FFFFFF'
	},
	// format for the text above color selection
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
		backgroundColor: '#757083',
		width: '88%',
		marginBottom: 5,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '15%'
	},
	chatButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF'
	},
	// box containing the color selections
	colorContainer: {
		flexDirection: 'row',
		alignSelf: 'flex-start',
		width: '80%',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	// format for the color selection bubbles
	colorBubbles: {
		position: 'relative',
		width: 40,
		height: 40,
		borderRadius: 20,
		margin: 2,
		borderWidth: 2,
		borderColor: 'white'
	},
	colorBubbles1: {
		backgroundColor: '#090C08'
	},
	colorBubbles2: {
		backgroundColor: '#474056'
	},
	colorBubbles3: {
		backgroundColor: '#8A95A5'
	},
	colorBubbles4: {
		backgroundColor: '#B9C6AE'
	},
	// format for the ring around selected color
	colorBubblesRing: {
		width: 50,
		height: 50,
		borderRadius: 25,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	colorBubblesNotActive: {
		backgroundColor: 'white'
	}
});
