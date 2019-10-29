import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import StyleSheet from './Header.component.style.js';

const Header = ({user, height, width, isLoggedIn, handleLogout, forgotPWToggle, forgotPWVisibility}) => {
	var styles = StyleSheet;
    const logoutText = <TouchableOpacity onPress={() => handleLogout()} style={{position: 'absolute', left: width/1.25, paddingleft: '3%',  width: '20%', height: '100%', zIndex: 10}}>
                            <Text style={{color: 'white', fontSize: 15, fontWeight: '900', top: 8}}>
                                Log ud
                            </Text>
                        </TouchableOpacity>;

	return(
		<View style={styles.borderContainer}>
			<View style={styles.container}>
			     
			</View>
            <TouchableOpacity onPress={()=>forgotPWToggle()} style={{position: 'absolute' , width: 60, height: 60, top: 7, left: width/2 - 30, zIndex: 10}}>
                            <Image source={require('../../assets/logo.png')} style={{width: 60, height: 60}}/>
            </TouchableOpacity>
            {
                isLoggedIn ? logoutText : null
            }
		</View>
		
	);
}

export default Header;