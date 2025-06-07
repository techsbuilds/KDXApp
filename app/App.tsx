import {NavigationContainer} from '@react-navigation/native';
import {RootNavigation} from './navigation/stack-navigation';
import {Provider} from 'react-redux';
import {persistor, store} from './redux';
import {PersistGate} from 'redux-persist/integration/react';
import {LogBox, SafeAreaView, StatusBar} from 'react-native';
import {StaticColors} from './themes';
import { useFonts } from "expo-font";
import Toast from 'react-native-toast-message';

LogBox.ignoreAllLogs();

const App = (): React.JSX.Element => {
  const [fontsLoaded] = useFonts({
    ["Font_MontserratBold"]: require("./assets/fonts/Montserrat-Bold.ttf"),
    ["Font_MontserratMedium"]: require("./assets/fonts/Montserrat-Medium.ttf"),
    ["Font_MontserratRegular"]: require("./assets/fonts/Montserrat-Regular.ttf"),
    ["Font_MontserratSemiBold"]: require("./assets/fonts/Montserrat-SemiBold.ttf"),
  });
  return (
      <Provider store={store}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={StaticColors.white}
        />
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <SafeAreaView style={{flex:1}}>
              <RootNavigation />
              <Toast />
            </SafeAreaView>
          </NavigationContainer>
        </PersistGate>
      </Provider>
  );
};

export default App;
