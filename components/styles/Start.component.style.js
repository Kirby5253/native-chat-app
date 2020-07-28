import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    position: 'absolute',
    bottom: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  colorPickContainer: { width: '88%' },
  // format for app title
  header: {
    fontSize: 45,
    fontWeight: '700',
    position: 'absolute',
    top: 100,
    color: '#FFFFFF',
  },
  // format for the text above color selection
  chooseColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  nameInputField: {
    width: '88%',
    borderColor: 'grey',
    borderWidth: 2,
    padding: 5,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
  },
  chatButton: {
    backgroundColor: '#757083',
    width: '88%',
    marginBottom: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '15%',
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // box containing the color selections
  colorContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  // format for the color selection bubbles
  colorBubbles: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 2,
    borderWidth: 2,
    borderColor: 'white',
  },
  colorBubbles1: { backgroundColor: '#090C08' },
  colorBubbles2: { backgroundColor: '#474056' },
  colorBubbles3: { backgroundColor: '#8A95A5' },
  colorBubbles4: { backgroundColor: '#B9C6AE' },
  // format for the ring around selected color
  colorBubblesRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBubblesNotActive: { backgroundColor: 'white' },
});
