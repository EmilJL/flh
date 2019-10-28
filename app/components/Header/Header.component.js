import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import StyleSheet from './Header.component.style.js';

const Header = ({user, height, width, isLoggedIn, handleLogout, forgotPWToggle, forgotPWVisibility}) => {
	var styles = StyleSheet;
    const logoutText = <TouchableOpacity onPress={() => handleLogout()} style={{position: 'absolute', left: width/1.25, paddingleft: '3%',  width: '20%', height: '100%', zIndex: 10}}>
                            <Text style={{color: 'white', fontSize: 15, fontWeight: '900', top: height/56}}>
                                Log ud
                            </Text>
                        </TouchableOpacity>;

	return(
		<View style={styles.borderContainer}>
			<View style={styles.container}>
			     
			</View>
            <TouchableOpacity onPress={isLoggedIn ? ()=>handleLogout() : (forgotPWVisibility ? ()=>forgotPWToggle() : null)} style={{position: 'absolute' , width: width/6, height: width/6, top:height/56+3.75, left: width/2 -width/12, zIndex: 10}}>
                            <Image source={require('../../assets/logo.png')} style={{width: width/6, height: width/6}}/>
            </TouchableOpacity>
            {
                isLoggedIn ? logoutText : null
            }
		</View>
		
	);
}

export default Header;