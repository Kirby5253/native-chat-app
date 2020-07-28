import React from 'react';
import { View, YellowBox, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
// displays maps when sending location info
import MapView from 'react-native-maps';
// listens for user connectivity
import NetInfo from '@react-native-community/netinfo';
import _ from 'lodash';
import { Buffer } from 'buffer';
import CustomActions from './CustomActions';

global.Buffer = Buffer;

// server used for storing messages and images
const firebase = require('firebase');
require('firebase/firestore');

// eliminate warning popup when testing
YellowBox.ignoreWarnings(['Warning: ...']);
// eslint-disable-next-line no-underscore-dangle
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

/**
 * The apps chat component which renders a chat interface
 * where users select a friend and chat with them
 * @class Chat
 * @requires react
 * @requires react-native
 * @requires react-native-gifted-chat
 * @requires react-native-maps
 * @requires react-native-community/netinfo
 * @requires CustomActions
 * @requires firebase/firestore
 */
export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    /**
     * firestore credentials
     * @param {string} apiKey
     * @param {string} authDomain
     * @param {string} databaseURL
     * @param {string} projectId
     * @param {string} storageBucket
     * @param {string} messageSenderId
     */
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
    // listens to current connectivity of device
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
        // Retrieves messages from cache when offline
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
   * @function getMessages
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

  /**
   * saves messages to AsyncStorage
   * @function saveMessages
   * @async
   * @return {Promise<string>} The data from the storage
   */
  saveMessages = async () => {
    const { messages } = this.state;
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * allows developer to delete messages from AsyncStorage
   * @function deleteMessages
   * @async
   */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * updates the state from database to display new messages whenever db is updated
   * @function onCollectionUpdate
   * @param {string} text message content text
   * @param {boolean} system tells Gifted Chat if message is from system (i.e. login message)
   * @param {string} _id message unique id
   * @param {date} createdAt message time stamp
   * @param {object} user username, id, and avatar of message sender
   * @param {string} image url, if available
   * @param {object} location longitude/latitude, if available
   */
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
    // sorts messages createdAt date to ensure accurate chronological order
    messages.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return -1;
    });
    this.setState({ messages });
    this.saveMessages();
  };

  /**
   * tells app what to do based on connectivity
   * when online, everything is updated from db and user can send messages
   * when offline, messages updated from storage and user can't send messages
   * @function handleConnectivityChange
   * @param {boolean} state whether user is connected to internet, or not
   */
  handleConnectivityChange = (state) => {
    const { isConnected } = state;

    if (isConnected === true) {
      console.log('online');
      this.setState({ isConnected: true });
      // authentication in case app doesn't reload when logging in offline
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

  /**
   * runs when send button is pressed
   * appends message to state, runs add message to send the message to db
   * runs the saveMessages to keep accurate local storage of messages
   * @function onSend
   * @returns this.addMessage()
   * @returns this.saveMessages()
   */
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({ messages: GiftedChat.append(previousState.messages, messages) }),
      () => {
        this.addMessage();
        this.saveMessages();
      },
    );
  };

  /**
   * sends system message that the user has entered the chat
   * @function loginMessage
   * @param {string} name user's name inherited from props
   */
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

  /**
   * adds message to firestore reference database
   * @function addMessage
   * @param {string} _id id given to message by gifted chat
   * @param {sting} text message text
   * @param {date} createdAt time stamp when message was created
   * @param {object} user user_id set by firebase, avatar picture, user.name
   * @param {string} image url, if available
   * @param {object} location longitude and latitude, if available
   * @param {boolean} sent verification of message sent
   */
  addMessage() {
    const { messages } = this.state;
    const message = messages[0];

    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      // date parsed so db doesn't use date param which gifted-chat won't read properly
      createdAt: Date.parse(message.createdAt),
      user: message.user,
      image: message.image || '',
      location: message.location || null,
      sent: true,
    });
  }

  /**
   * gifted chat function that allows customization of chat bubble color, change color to customize
   * @function renderBubble
   * @param {*} props
   */
  renderBubble = (props) => (
    <Bubble {...props} wrapperStyle={{ right: { backgroundColor: '#000' } }} />
  );

  /**
   * gifted chat function that allows customization of send button color, change color to customize
   * @function renderSend
   * @param {*} props
   */
  renderSend = (props) => <Send {...props} textStyle={{ color: '#0a84fa' }} label="Send" />;

  /**
   * gifted chat function that hides toolbar when the user is not online
   * @function renderInputToolbar
   * @param {*} props
   */
  renderInputToolbar = (props) => {
    const { isConnected } = this.state;
    if (isConnected === false) {
      return null;
    }
    return <InputToolbar {...props} />;
  };

  /**
   * gifted chat function that adds the add image/camera/location capability to gifted chat
   * @function renderCustomActions
   * @param {*} props
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  /**
   * gifted chat function that shows maps when location is sent/received
   * @function renderCustomView
   * @requires MapView
   * @param {*} props
   */
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
    // inherits user name and background color selection from start page
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
          // renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          renderInputToolbar={this.renderInputToolbar}
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
