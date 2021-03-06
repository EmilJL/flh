import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center'
  },
  buttonBorder: {
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 10,
    borderColor: '#5F5F5F',
    position: 'absolute'
  },
  button: {
    backgroundColor: '#D58649',
  	alignContent: 'center',
  	justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 10,
    borderColor: '#bf6c2c',
    position: 'absolute'
  },
  buttonTimer: {
    bottom: 35,
  	fontWeight: '300',
  	fontSize: 16,
    color: '#ffffff',
    textAlign: 'center'
  },
  buttonLabel: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    alignSelf: 'center',
    position: 'absolute'
  },
  infoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center'
  }
});