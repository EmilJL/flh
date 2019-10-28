import React, {Component} from 'react';
import {Text, View, ImageBackground, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, PermissionsAndroid, Alert} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import Header from './components/Header/Header.component';
import Main from './components/Main/Main.component';
import Login from './components/Login/Login.component';

import ForgotPassword from './components/Login/ForgotPassword.component';

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


export default class App extends Component {
	state={
		isLoadingData: false,
		isLoggedIn: false,
		forgotPW: false,
		isAppStart: true,
		userData: {},
		siteData: {},	
		username: '',
		password: '',
		width: 0,
		height: 0,
		hasLocationPermission: null,
		gotStatus: false,
		gotSiteData: false
	}


	handleForgotPWToggle = () => {
		let forgotPW = !(this.state.forgotPW);
		this.setState({forgotPW});
	}

	checkLocationPermission = () => {
		return PermissionsAndroid.check('ACCESS_FINE_LOCATION')
				.then((result) => {
					if (result) {
						this.setState({hasLocationPermission: true});
					}
					else {
						
						return PermissionsAndroid.request(
							PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
						)
						.then((granted) => {
							if (granted === PermissionsAndroid.RESULTS.GRANTED) {
								this.setState({hasLocationPermission: true});
							}
							else {
								Alert.alert(
				  'Lokation påkrævet!',
				  'Du har ikke slået lokation til, og kan derfor ikke chekke ind.',
				  [
				    {text: 'OK'},
				  ],
				  {cancelable: false},
				);
								this.setState({hasLocationPermission: false});
							}
						})
					}
				})
				.catch(error => console.error(error));
	}

	handleLogin = (user, username, password) => {

		this.setState({isLoadingData: true, isLoggedIn: true, user: user, username: username, password: password});
		this.getSiteData();
		this.getStatus();
	}
	handleLogout = () => {
		this.setState({isLoggedIn: false});
	}
	handleAppAccess = () => {
		this.setState({isAppStart: false});
	}
	getStatus = () => {
		this.setState({gotStatus: false})
		return fetch('https://flh.nu/wp-json/flh/v1/logtime/me/', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sUsername: this.state.username,
				sPassword: this.state.password
			}),
		})
		.then(processResponse)
		.then(res => {
			const { statusCode, data } = res;

        	if (statusCode == 200) {
	       		  Alert.alert(
					  'Ikke checket ud!',
					  'Du har ikke checket ud, sidst Appen er blevet lukket. Du bliver checket ud nu.',
					  [
					    {text: 'OK'},
					  ],
					  {cancelable: false},
					);
        	}
        	this.setState({gotStatus: true});
        	if (this.state.gotSiteData) {
        			this.setState({isLoadingData: false});
        		}
        	Promise.resolve();
		})
		.catch(error => console.error(error));
	}
	getSiteData = () => {
		this.setState({gotSiteData: false})
		return fetch('https://flh.nu/wp-json/flh/v1/worksite/me', {
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
        		this.setState({siteData: data, gotSiteData: true});
        		if (this.state.gotStatus){
        			this.setState({isLoadingData: false});
        		}
        		
        	}
        	else {
        		 Alert.alert(
					  'Ingen arbejdsplads!',
					  'Du er ikke tilknyttet nogen arbejdsplads. Kontakt venligst din arbejdsgiver, eller prøv igen.',
					  [
					    {text: 'OK'},
					  ],
					  {cancelable: false},
					);
        	}
        	Promise.resolve();
		})
		.catch(error => console.error(error));
	}

	componentDidMount(){
		if (Platform.OS === 'android') {
			this.checkLocationPermission();
		}
		const screenWidth = Math.round(Dimensions.get('window').width);
		const screenHeight = Math.round(Dimensions.get('window').height);
		this.setState({width: screenWidth, height: screenHeight});
	}
	
	componentWillUnmount(){

	}

	render() {
		const height = this.state.height;
		const width = this.state.width;
		
		if (this.state.isLoggedIn) {
			if (this.state.isLoadingData) {
				return(
					<ImageBackground source={require('./assets/bg.png')} style={{height: height*1.05, alignContent: 'center', justifyContent: 'center'}}>
						<View style={{marginLeft: width/3, width: width/3, height: width/3}}>
							<Image source={require('./assets/logo.png')} style={{width: width/3, height: width/3}}/>
							<Text style={{position: 'relative', top: 2, textAlign: 'center', color: '#ffffff', fontSize: 17}}>
									Henter data...			
							</Text>
						</View>
					</ImageBackground>
				);
			}
			else {
				return(
					<ImageBackground source={require('./assets/bg.png')} style={{height: height*1.05, alignContent: 'center', justifyContent: 'center'}}>
						<Main handleLogout={() => {this.handleLogout()}} isLoggedIn={this.state.isLoggedIn} siteData={this.state.siteData} hasLocationPermission={this.state.hasLocationPermission} checkLocationPermission={() => {this.checkLocationPermission()}} username={this.state.username} password={this.state.password} height={height} width={width}/>
					</ImageBackground>
				);
			}
		}
						
		else {
				if (this.state.isAppStart) {
					return(
						<ImageBackground source={require('./assets/bg.png')} style={{height: height*1.05, alignContent: 'center', justifyContent: 'center'}}>
							<TouchableOpacity onPress={() => {this.handleAppAccess()}} style={{marginLeft: width/3, width: width/3, height: width/3}}>
								<Image source={require('./assets/logo.png')} style={{width: width/3, height: width/3}}/>
							</TouchableOpacity>
						</ImageBackground>
					);
				}
				else {
					if (this.state.forgotPW) {
						return(
							<ImageBackground source={require('./assets/bg.png')} style={{height: height*1.05, alignContent: 'center', justifyContent: 'flex-end'}}>
								<View style={{height: height/14, width: width, position: 'absolute', top: 0, left: 0}}>
									<Header forgotPWToggle={() => {this.handleForgotPWToggle()}} forgotPWVisibility={this.state.forgotPW} handleLogout={this.handleLogout} height={height} width={width} isLoggedIn={this.state.isLoggedIn}/>
								</View>
								<KeyboardAvoidingView style={{height: height/1.4, width: '100%', justifyContent: 'flex-end'}} behavior='padding'>
									<ForgotPassword height={height} width={width} forgotPWToggle={() => {this.handleForgotPWToggle()}}/>
								</KeyboardAvoidingView>
							</ImageBackground>
						);
					}
					else {
						return(
							<ImageBackground source={require('./assets/bg.png')} style={{height: height*1.05, alignContent: 'center', justifyContent: 'flex-end'}}>
								<View style={{height: height/14, width: width, position: 'absolute', top: 0, left: 0}}>
									<Header forgotPWToggle={() => {this.handleForgotPWToggle()}} forgotPWVisibility={this.state.forgotPW} handleLogout={this.handleLogout} height={height} width={width} isLoggedIn={this.state.isLoggedIn}/>
								</View>
								<KeyboardAvoidingView keyboardShouldPersistTaps={"handled"} style={{height: height/1.4, width: '100%', justifyContent: 'flex-end'}} behavior='padding'>
									<Login height={height} width={width} onLogin={(user, username, password) => {this.handleLogin(user, username, password)}} forgotPWToggle={() => {this.handleForgotPWToggle()}}/>
								</KeyboardAvoidingView>
							</ImageBackground>
						);
					}
				}
		}
  	}
}