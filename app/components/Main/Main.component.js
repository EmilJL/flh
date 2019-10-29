import React, {Component} from 'react';
import {Text, View, Platform, TouchableOpacity, Alert, DeviceEventEmitter, ScrollView, AsyncStorage} from 'react-native';
import Header from '../Header/Header.component';
import StyleSheet from './Main.component.style';
import Geolocation from 'react-native-geolocation-service';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Boundary, {Events} from 'react-native-boundary';
import BackgroundTask from 'react-native-background-task';

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
function calcCrow(coords1lat, coords1lng, coords2lat, coords2lng)
{
  var R = 6371;
  var dLat = toRad(coords2lat-coords1lat);
  var dLon = toRad(coords2lng-coords1lng);
  var lat1 = toRad(coords1lat);
  var lat2 = toRad(coords2lat);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c * 1000;
  return d;
}
function toRad(Value)
{
    return Value * Math.PI / 180;
}

class Main extends Component {
	state={
		timeCheckedIn: null,
		timer: null,
		seconds: 0,
		minutes: 0,
		hours: 0,
		totalTime: '00:00:00',
		watchID: -1,
		hasRunningLog: false,
		locationEnabled: false,
		initialPosition: 'unknown',
		isOnWorksite: false,
		currentWorksiteID: null,
	}

	storeData = async (itemName, itemValue) => {
	  try {
	    await AsyncStorage.setItem('@LocationStore:'+itemName, itemValue);
	  } catch (error) {
	  }
	}

	handleCheckin = () => {
			this.props.checkLocationPermission();
			if (this.state.locationEnabled && this.props.hasLocationPermission) {
				return fetch('https://flh.nu/wp-json/flh/v1/logtime/me/', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						sUsername: this.props.username,
						sPassword: this.props.password,
						iWorksiteID: this.state.currentWorksiteID,
					}),
				})
				.then((response) => response.json())
				.then(responseJson => {
					let timeCheckedIn = new Date();
						timeCheckedIn.setHours(timeCheckedIn.getHours() - 2);
						this.setState({timeCheckedIn});
						let timer = setInterval(() => this.handleTimerTick(), 1000);
						this.setState({timer});
						this.setState({hasRunningLog: true});
						this.storeData("hasRunningLog", "yes");
						BackgroundTask.cancel();
						BackgroundTask.schedule();
					Promise.resolve();
				})
				.catch(error => console.error(error));
			}
	}
	handleCheckout = (isLogout) => {
		return fetch('https://flh.nu/wp-json/flh/v1/logtime/me/', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sUsername: this.props.username,
				sPassword: this.props.password
			}),
		})
		.then(processResponse)
		.then(res => {
			const { statusCode, data } = res;
        	if (statusCode == 200 || statusCode == 500) {
				try {
					this.setState({totalTime: '00:00:00', seconds: 0, minutes: 0, hours: 0, hasRunningLog: false});
					clearInterval(this.state.timer);
					this.storeData("hasRunningLog", "no");
				}
				catch(e) {			
				}
        	} 	
        	else {
        		console.log('wtf');
        	}
        	BackgroundTask.cancel();
        	if (isLogout) {
        		this.props.handleLogout();
        	}
		})
		.catch(error => console.error(error));

	}
	handleLogout = () => {
		this.handleCheckout(true);
	}
	handleButtonClick = () => {
		this.checkIfWithinRadius();
		if (!(this.state.hasRunningLog)) {
			if (this.state.isOnWorksite && this.state.locationEnabled) {
				this.handleCheckin();
			}
			else {
				Alert.alert(
				  'Oops!',
				  'Du er ikke inden for et arbejdsområde. Se eventuelt om lokalitet er slået fra på telefonen.',
				  [
				    {text: 'OK'},
				  ],
				  {cancelable: false},
				)
			}
		}
		else {
			this.handleCheckout(false);
		}
	}
	checkIfWithinRadius = () => {
		var currentLat;
		var currentLon;
		if (Platform.OS === 'android') {}
		Geolocation.getCurrentPosition(
		(position) => {
			currentLat=position.coords.latitude;
			currentLon=position.coords.longitude;
			var sites = this.props.siteData;
		var isWithin = false;
		for (var i = 0; i < sites.length; i++) {
			var distance = calcCrow(sites[i].iLat, sites[i].iLng, currentLat, currentLon);
			if (distance < sites[i].iRadius) {
				isWithin = true;
			}
		}

		if (isWithin) {
			this.setState({isOnWorksite: true});
			console.log('ok');
		}
		else {
			if(this.state.hasRunningLog){
				this.handleCheckout(false);
				Alert.alert(
				  'Ude for område!',
				  'Du har forladt dit arbejdsområde, og bliver derfor chekket ud.',
				  [
				    {text: 'OK'},
				  ],
				  {cancelable: false},
				)
			}
			this.setState({isOnWorksite: false});
		}
					},
		            (error) => {
		                // See error code charts below.
		                console.log(error.code, error.message);
		            },
		            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
		);
	}

	handleTimerTick = () => {
			var start = this.state.timeCheckedIn;
			var now = new Date();
			now.setHours(now.getHours() - 2);		
			var diff = now-start;
			var hours = Math.floor(diff / (1000 * 60 * 60));
			diff -= hours * (1000 * 60 * 60);
			var minutes = Math.floor(diff / (1000 * 60));
			diff -= minutes * (1000 * 60);
			var seconds = Math.floor(diff / (1000));
			diff -= seconds * (1000);
			
		if (seconds == 59) {
			seconds = 0;
			if (minutes == 59) {
				minutes = 0;
				hours++;
			}
			else {
				minutes++;
			}
		}
		else {
			seconds++;
		}

		let totalTime = (hours > 9 ? ""+hours : "0"+hours) + ':' + (minutes > 9 ? ""+minutes : "0"+minutes) + ':' + (seconds > 9 ? ""+seconds : "0"+seconds);
		this.setState({seconds, minutes, hours, totalTime});
	}
	componentDidMount()
			LocationServicesDialogBox.checkLocationServicesIsEnabled({
	            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
	            ok: "YES",
	            cancel: "NO",
	            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
	            showDialog: true, // false => Opens the Location access page directly
	            openLocationServices: true, // false => Directly catch method is called if location services are turned off
	            preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
	            preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
	            providerListener: ´false // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
        	}).then(function(success) {
	            // success => {alreadyEnabled: true, enabled: true, status: "enabled"}
            	this.setState({locationEnabled: true });
	        }.bind(this)).catch((error) => {
	            console.log(error.message);
        	});
		}

	}
	componentWillUnmount(){
		clearInterval(this.state.timer);
	}
	render(){
		const styles = StyleSheet;
		const user = this.props.user;
		const width = this.props.width;
		const height = this.props.height;
		return(
			<View style={{flex: 1}}>
			<View style={{height: 40, width: width, position: 'absolute', top: 0, left: 0}}>
				<Header handleLogout={() => {this.handleLogout()}} height={height} width={width} isLoggedIn={this.props.isLoggedIn}/>
			</View>
				<View style={styles.container}>
					<View style={[styles.buttonBorder, {width: 200, height: 200, borderRadius: 200}]}>
						<TouchableOpacity onPress={() => this.handleButtonClick()} style={[styles.button, {width: 180, height: 180, borderRadius: 180}]}>
							<Text style={styles.buttonTimer}>
								{this.state.hasRunningLog ? this.state.totalTime : ''}
							</Text>
							
							<Text style={styles.buttonLabel}>
								{this.state.hasRunningLog ? 'CHECK UD' : 'CHECK IND'}
							</Text>
							
						</TouchableOpacity>
					</View>
					<Text style={[styles.infoText, {top: 150}]}>
						{this.state.hasRunningLog ? 'Husk at checke ud, når du forlader pladsen.' : 'Du kan kun checke ind, når du er på eller i nærheden af pladsens område.'}
					</Text>
				</View>
			</View>
		);
	}
}

export default Main;