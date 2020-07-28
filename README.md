# React Native Chat App

This React Native app is a project created for learning purposes of designing and implementing chat functionality on the mobile platform.

To install modules after downloading:
```sh
$ yarn
```

To run mod after installing all dependencies:
```sh
$ expo start
```

Since this is using expo, make sure that expo is installed globally
```sh
$ npm install expo -g
```
For more specific expo instructions, visit https://docs.expo.io/get-started/installation/


  - The app needs a smartphone or emulator to run/test the app
  - Download the Android Studio app on Windows, or you can use XCode from the App store on Mac
  - Follow the instructions from the corresponding apps to install the emulator/simulator

## Database(Firebase) Setup

This is currently run on the database Firebase for learning purposes.

If you'd like to update the Firebase credentials you would change the following information under constructor on Chat.js:

![Firestore Initialization](/images/firestoreInitialize.png)

### Firebase Instructions

1. Login with Google Credentials at https://firebase.google.com/

1. Click 'Go To Console'

1. Click 'Add project' and give your project a name

1. Select default options until after clicking 'Create project'

1. Once project is created: Select 'Database' from the menu column then select 'Create database'

1. Select test mode and your current region, then click Done

1. Once database is created, go to 'Settings'(gear) in the menu column and select 'Project Settings'

1. In the bottom 'Your apps' section, select the embed option ( </> ). Give your app a nickname and register it.

1. Copy the contents from 'apiKey' to 'messagingSenderId' into the Chat component in the picture above.

![Firestore Credentials](/images/firestoreCredentials.png)

## Dependencies

````
    react-native-community/masked-view
    react-native-community/netinfo
    react-navigation/native
    react-navigation/stack
    buffer
    eslint-plugin-react
    expo
    expo-image-picker
    expo-location
    expo-permissions
    firebase
    grpc
    lodash
    moment
    prop-types
    react
    react-dom
    react-native
    react-native-gesture-handler
    react-native-gifted-chat
    react-native-keyboard-spacer
    react-native-maps
    react-native-reanimated
    react-native-safe-area-context
    react-native-screens
    react-native-web
    react-navigation
    react-navigation-stack
````
## Chat UI Example

Example used an emulator which was significantly slower than on an actual device

![User Interface](/images/test.gif)