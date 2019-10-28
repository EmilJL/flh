import React, {Component} from 'react';
import {Text, TextInput, View, Dimensions, Platform, Alert} from 'react-native';
import {Button} from "react-native-elements";
import StyleSheet from './Login.component.style';


class ForgotPassword extends Component {
	state= {
		email: ''
	}

	handlePWRequest = () => {
		return fetch('https://flh.nu/wp-json/flh/v1/login/', {
			method: 'POST',
			headers: {
				Accept: '*/*'
			},
			body: JSON.stringify({
				sEmail: this.state.email
			}),
		})
		.then((response) => response.json())
		.then((res) => {
			/*var title;
			var message;
			if (res == true) {
				title = 'Success!';
				message = 'Du har fået tilsendt et link på din mail.'
			}
			else {
				title = 'Der gik noget galt..';
				message = 'Tjek venligst om den angivne email-adresse er korrekt indtastet. Ellers prøv igen om lidt.';
			}*/
			Alert.alert(
			  'Success!',
			  'Der er blevet sendt et link til den indtastede e-mail.',
			  [
			    {text: 'OK', onPress: ()=>this.props.forgotPWToggle()},
			  ],
			  {cancelable: false},
			);
		})
		.catch(error => console.error(error));
	}
	
	render(){
		const styles = StyleSheet;
		const height = this.props.height;
		const width = this.props.width 
		const navbarHeight = Platform.select({ ios: 20, android: 24 });
		return(
			<View style={[styles.container, {height: height/1.9, width: width, paddingTop: width/15, paddingLeft: width/15, paddingRight: width/15, paddingBottom: width/15+navbarHeight}]}>

				<Text style={styles.textHeader}>Glemt adgangskode?</Text>

				<View style={{flex: 1.5}}>
					<TextInput placeholder='Indtast din e-mail' textContentType='username' onChangeText={(input) => this.setState({email: input})} keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'} style={styles.textInput}/>
				</View>
				
			
				<View style={{flex: 3, justifyContent: 'center', alignContent: 'center'}}>
					<Button title={'SEND KODE'} buttonStyle={[styles.button, {width: width/2.2, height: width/6.6, borderRadius: width/2.2}]} titleStyle={styles.buttonFont} onPress={() => this.handlePWRequest()}/>
				</View>
				<View style={styles.forgotPWTouchableOpacity}>
					<Text style={styles.forgotPWLabel}>
						Indtast din e-mail, så sender vi et link til nulstillelse af adgangskode.
					</Text>
				</View>
			</View>
		);
	}
}

export default ForgotPassword;