import React, {Component} from 'react';
import {Text, TextInput, TouchableOpacity, View, Dimensions, Platform, Alert, ScrollView} from 'react-native';
import {Button} from "react-native-elements";
import StyleSheet from './Login.component.style';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

function processResponse(response){
	const statusCode = response.status;
	var data;
	if (statusCode == 200) {
		data = response.json();
	}
	else {
		data = {}
	}
	
	return Promise.all([statusCode, data]).then(res => ({
		statusCode: res[0] ? res[0] : 999,
		data: res[1]
	}));
}



class Login extends Component {
	state= {
		username: '',
		password: ''
	}

	handleLoginPress = () => {
		return fetch('https://flh.nu/wp-json/flh/v1/login/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sUsername: this.state.username,
				sPassword: this.state.password,
			}),
		})
		.then(processResponse)
		.then(res => {
			const { statusCode, data } = res;

        	if (statusCode == 200) {
        		this.props.onLogin(data, this.state.username, this.state.password);
        	}
        	else if (statusCode == 401){
        		Alert.alert(
				  'Oops!',
				  'De indtastede oplysninger er forkerte. Prøv igen.',
				  [
				    {text: 'OK', onPress: this.setState({password: ''})},
				  ],
				  {cancelable: false},
				);
        	}
        	Promise.resolve();
		})
		.catch(error => console.error(error));
	}
		
	
	render(){
		const styles = StyleSheet;
		const height = this.props.height;
		const width = this.props.width 
		const navbarHeight = Platform.select({ ios: 20, android: 24 });
		return(
			<View style={[styles.container, {height: 400, width: width, paddingTop: 20, paddingLeft: 25, paddingRight: 25, paddingBottom: 25+navbarHeight}]}>
				<Text style={styles.textHeader}>Log venligst ind</Text>

				<View style={styles.textInputContainer}>
					<TextInput selectTextOnFocus={true} onSubmitEditing={() => { this.secondTextInput.focus(); }} blurOnSubmit={false} returnKeyType = { "next" } textContentType='emailAddress' placeholder='Indtast din e-mail'  onChangeText={(input) => this.setState({username: input})} keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'} style={styles.textInput}/>
					<TextInput selectTextOnFocus={true} ref={(input) => { this.secondTextInput = input; }} textContentType='password' placeholder='Indtast dit kodeord' onChangeText={(input) => this.setState({password: input})} style={styles.textInput} secureTextEntry={true}/>
				</View>
				
				<View style={styles.buttonContainer}>
					<Button title={'LOG IND'} buttonStyle={[styles.button, {width: 170, height: 55, borderRadius: 55}]} titleStyle={styles.buttonFont} onPress={() => this.handleLoginPress()}/>
				</View>		
				<TouchableOpacity onPress={() => this.props.forgotPWToggle()} style={[styles.forgotPWTouchableOpacity]}>
					<Text style={styles.forgotPWLabel}>
						Glemt dit log in? Tryk her
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default Login;