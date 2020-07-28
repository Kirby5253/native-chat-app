/* eslint-disable max-len */
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import styles from './styles/Start.component.style';
// Defines img path for background
const image = require('../assets/startBackgroundImage.png');
const usernameIcon = require('../assets/userIcon2.png');

// The apps starting component which renders an input where users set a name and them for their profile

/**
 * The apps starting component which renders an input where users
 * set a name and them for their profile
 * @class Start
 * @requires react
 * @requires react-native
 * @requires react-native-gesture-handler
 * @requires image from '../assets/startBackgroundImage.png'
 * @requires usernameIcon from ../assets/userIcon2.png'
 * @requires styles from './styles/Start.component.style'
 */
export default class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      background: '#090C08',
    };
  }

  render() {
    const { name, background } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {/* Sets the background for the app */}
        <ImageBackground source={image} style={styles.image}>
          {/* App Title */}
          <Text style={styles.header}>Kirby&#39;s Chat App</Text>

          {/* Main interactive section of start page  */}
          <View style={styles.container2}>
            <View style={styles.SectionStyle}>
              <Image source={usernameIcon} style={styles.ImageStyle} />
              {/* Allow users to enter their name */}
              <TextInput
                style={styles.nameInputField}
                placeholder="Your Name"
                onChangeText={(text) => this.setState({ name: text })}
                value={name}
              />
            </View>

            {/* Grouping of the color selection section */}
            <View style={styles.colorPickContainer}>
              <Text style={styles.chooseColor}>Choose Background Color:</Text>

              {/* Contains the color bubbles */}
              <View style={styles.colorContainer}>
                {/* First color bubble selector */}
                <View
                  style={[
                    styles.colorBubbles1,
                    background === '#090C08'
                      ? styles.colorBubblesRing
                      : styles.colorBubblesNotActive,
                  ]}
                >
                  <TouchableOpacity onPress={() => this.setState({ background: '#090C08' })}>
                    <View style={[styles.colorBubbles, styles.colorBubbles1]} />
                  </TouchableOpacity>
                </View>

                {/* Second color bubble selector */}
                <View
                  style={[
                    styles.colorBubbles2,
                    background === '#474056'
                      ? styles.colorBubblesRing
                      : styles.colorBubblesNotActive,
                  ]}
                >
                  <TouchableOpacity onPress={() => this.setState({ background: '#474056' })}>
                    <View style={[styles.colorBubbles, styles.colorBubbles2]} />
                  </TouchableOpacity>
                </View>

                {/* Third color bubble selector */}
                <View
                  style={[
                    styles.colorBubbles3,
                    background === '#8A95A5'
                      ? styles.colorBubblesRing
                      : styles.colorBubblesNotActive,
                  ]}
                >
                  <TouchableOpacity onPress={() => this.setState({ background: '#8A95A5' })}>
                    <View style={[styles.colorBubbles, styles.colorBubbles3]} />
                  </TouchableOpacity>
                </View>

                {/* Fourth color bubble selector */}
                <View
                  style={[
                    styles.colorBubbles4,
                    background === '#B9C6AE'
                      ? styles.colorBubblesRing
                      : styles.colorBubblesNotActive,
                  ]}
                >
                  <TouchableOpacity onPress={() => this.setState({ background: '#B9C6AE' })}>
                    <View style={[styles.colorBubbles, styles.colorBubbles4]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Start the chat button */}
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('Chat', { name, background })}
            >
              <Text style={styles.chatButtonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
