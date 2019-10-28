import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  borderContainer: {
    height: '100%',
    width: '100%',
    borderBottomWidth: 5,
    borderColor: '#D58649',
    zIndex: 3,
    position: 'absolute',
    top: 0,
    left: 0
  },
  container: {
    height: '100%',
    width: '100%',
  	flexDirection: 'row',
  	backgroundColor: 'black',
    opacity: 0.4,
  	alignContent: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0
  },
/*  userInfoContainer: {
  },*/
  logoutContainer: {
  	alignContent: 'center',
  	flexDirection: 'row'
  },
  logoutContainer_hidden: {
    opacity: 0
  },
  logoutContainer_visible: {
    opacity: 1
  },
/*  logoutLabel: {
  	color: '#ffffff',
  	fontSize: 16
  }*/
  logoutImage: {
/*  	width: 25,
  	height: 25*/
  },
});