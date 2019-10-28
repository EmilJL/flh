/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';

AppRegistry.registerHeadlessTask('SomeTaskName', () => SomeTaskName);
AppRegistry.registerComponent(appName, () => App);
