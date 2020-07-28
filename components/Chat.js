/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { View, YellowBox, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo';
import _ from 'lodash';
import { Buffer } from 'buffer';
import CustomActions from './CustomActions';

global.Buffer = Buffer;

const firebase = require('firebase');
require('firebase/firestore');

YellowBox.ignoreWarnings(['Warning: ...']);
// eslint-disable-next-line no-underscore-dangle
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

/** The apps chat component which renders a chat interface
 * where users select a friend and chat with them */
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
        messagingSenderId: '732125871625',
      });
    }

    // creates reference to messages collection in DB
    this.referenceMessages = firebase.firestore().collection('messagesNew');

    this.state = { messages: [] };
  }

  componentDidMount() {
    this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      this.handleConnectivityChange(state);
    });

    // Determines if user is online
    NetInfo.fetch().then((state) => {
      const { isConnected } = state;
      if (isConnected) {
        this.setState({ isConnected: true });

        // when component mounts, a system message is sent to the chat
        const { route: { params: { name } } } = this.props;
        this.loginMessage(name);

        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          try {
            if (!user) {
              await firebase.auth().signInAnonymously();
            } else {
              // update user state with currently active user data
              this.setState({ uid: user.uid });
            }
          } catch (error) {
            console.log(error.message);
          }

          // create a reference to the active user's documents
          this.referenceMessagesUser = firebase
            .firestore()
            .collection('messagesNew')
            .orderBy('createdAt', 'asc');
          // listen for collection changes for current user
          this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(
            this.onCollectionUpdate,
          );
        });
      } else {
        console.log('offline');
        this.setState({ isConnected: false });
        // Retrieves messages from cache
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    // eslint-disable-next-line no-unused-expressions
    this.authUnsubscribe;
    // stop listening for changes
    // eslint-disable-next-line no-unused-expressions
    this.unsubscribeMessagesUser;
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  /**
* loads all messages from AsyncStorage
* @async
* @return {Promise<string>} The data from the storage
*/
  getMessages = async () => {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({ messages: JSON.parse(messages) });
    } catch (error) {
      console.log(error.message);
    }
  };

  saveMessages = async () => {
    const { messages } = this.state;
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each doc
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        text: data.text.toString(),
        system: data.system,
        _id: data._id,
        createdAt: data.createdAt,
        user: data.user,
        image: data.image || '',
        location: data.location,
      });
    });
    messages.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return -1;
    });
    this.setState({ messages });
    this.saveMessages();
  };

  handleConnectivityChange = (state) => {
    const { isConnected } = state;

    if (isConnected === true) {
      console.log('online');
      this.setState({ isConnected: true });
      this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            await firebase.auth().signInAnonymously();
          } else {
            // update user state with currently active user data
            this.setState({ uid: user.uid });
          }
        } catch (error) {
          console.log(error.message);
        }
      });
    } else {
      this.setState({ isConnected: false });
      console.log('offline');
      this.getMessages();
    }
  };

  // This appends the message to the state of the chat
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({ messages: GiftedChat.append(previousState.messages, messages) }),
      () => {
        this.addMessage();
        this.saveMessages();
      },
    );
  };

  // Sends system message that the user has entered the chat
  loginMessage = (name) => {
    const randomNumber = Math.floor(Math.random() * 1000000000000000000);
    this.referenceMessages.add({
      createdAt: Date.parse(new Date()),
      system: true,
      _id: randomNumber,
      text: `${name} has entered the chat`,
    });
  };

  // Sends system message that the user has left the chat
  logoutMessage = (name) => {
    const randomNumber = Math.floor(Math.random() * 1000000000000000000);
    this.referenceMessages.add({
      createdAt: Date.parse(new Date()),
      system: true,
      _id: randomNumber,
      text: `${name} has left the chat`,
    });
  };

  addMessage() {
    const { messages } = this.state;
    const message = messages[0];

    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: Date.parse(message.createdAt),
      user: message.user,
      image: message.image || '',
      location: message.location || null,
      sent: true,
    });
  }

  // Allows customization of chat bubble color
  renderBubble = (props) => (
    <Bubble {...props} wrapperStyle={{ right: { backgroundColor: '#000' } }} />
  );

  // Customize blue send button to correct text style change
  renderSend = (props) => <Send {...props} textStyle={{ color: '#0a84fa' }} label="Send" />;

  renderInputToolbar = (props) => {
    const { isConnected } = this.state;
    if (isConnected === false) {
      return null;
    }
    return <InputToolbar {...props} />;
  };

  renderCustomActions = (props) => <CustomActions {...props} />;

  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  render() {
    const { route: { params: { name } } } = this.props;
    const { route: { params: { background } } } = this.props;
    const { messages, uid } = this.state;
    const { navigation } = this.props;

    // Set the name on the navigation bar
    navigation.setOptions({ title: name });

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: background,
        }}
      >
        <GiftedChat
          // Allows for black message text for the light background option
          textStyle={
            background === '#B9C6AE' || background === '#8A95A5' ? (
              { color: 'black' }
            ) : (
              { color: '#CFD1D2' }
            )
          }
          // Changes color of the bubble
          // renderBubble={this.renderBubble.bind(this)}
          renderSend={this.renderSend.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={messages}
          onSend={(text) => this.onSend(text)}
          user={{
            _id: uid,
            name,
            avatar: '',
          }}
        />
      </View>
    );
  }
}
