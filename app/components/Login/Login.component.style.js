import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    marginBottom: 0,
  	alignContent: 'stretch',
  	height: '100%',
  	width: '100%',
  	justifyContent: 'center',
    backgroundColor: '#d9dfe0',
    borderTopWidth: 5,
    borderColor: '#D58649'
  },
  textHeader: {
    fontSize: 24, 
    fontWeight: '900',
    textAlign: 'center',
    flex: 2.2,
    letterSpacing: -1,
    marginTop: 5
  },
  textInputContainer: {
    flex: 4,
    justifyContent: 'space-between',
    alignContent: 'space-between'
  },
  textInput: {
    color: '#5F5F5F',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    
  },
  buttonContainer: {
    flex: 3.5, 
    justifyContent: 'center',
    alignContent: 'center'
  },
  button: {
  	backgroundColor: '#D58649',
    alignSelf: 'center',
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1, 
    shadowRadius: 2, 
    elevation: 6
  },
  buttonFont: {
  	textAlign: 'center',
  	color: '#ffffff'
  },
  forgotPWTouchableOpacity: {
    flex: 2,
    justifyContent: 'flex-start',
    alignContent: 'center',

  },
  forgotPWLabel: {
  	fontSize: 14,
    textAlign: 'center',
    color: '#5F5F5F', 
  }
});