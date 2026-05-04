import 'react-native-gesture-handler';
import { enableScreens, enableFreeze } from 'react-native-screens';
import { registerRootComponent } from 'expo';

import App from './App';

// Active les écrans natifs (UINavigationController/Fragment) avant tout import de navigation.
// Indispensable pour des transitions fluides à 60+ fps via @react-navigation/native-stack.
enableScreens(true);
// Gèle les écrans hors-focus pour économiser CPU/GPU/RAM (utile pour scaler à 10K users).
enableFreeze(true);

registerRootComponent(App);
