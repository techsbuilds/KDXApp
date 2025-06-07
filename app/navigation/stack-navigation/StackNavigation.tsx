import React, { useEffect } from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import { Routes, Screens } from "../../constants";
import {
  GenerateInvoiceScreen,
  HistoryScreen,
  HomeScreen,
  InvoiceDetailScreen,
  InvoiceScreen,
  ProfileScreen,
  ReportScreen,
} from "../../modules";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Images } from "../../assets";
import { StaticColors, width } from "../../themes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { AppText } from "../../components";
import FullScreenDrawer from "../drawer-navigation/DrawerNavigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, userActions } from "../../redux";
import LoginScreen from "../../modules/Login/LoginScreen";
import SignupScreen from "../../modules/Register/RegisterScreen";
import VerifyOtpScreen from "../../modules/VerifyOTP/verify";

type DrawerStackParamList = {
  HomeStack: undefined;
  ProfileScreen: undefined;
};

type HomeStackParamList = {
  BottomTabs: undefined;
};

type BottomTabParamList = {
  [K in keyof typeof Routes]: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Drawer = createDrawerNavigator<DrawerStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

interface CustomHeaderProps {
  navigation: DrawerNavigationProp<DrawerStackParamList, "HomeStack">;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuButton}
      >
        <Image source={Images.menuIcon} style={{ height: 24, width: 24 }} />
      </TouchableOpacity>
     {
      /* <Image
        source={Images.headerLogo}
        style={styles.logo}
        resizeMode="contain"
      />*/
    }
    </View>
  );
};
const TabCount = Object.keys(Routes).length;
const TabWidth = (width - (20 + 8 * (TabCount - 1))) / TabCount;
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={[styles.tabBarContainer]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] as {
          options: BottomTabNavigationOptions;
        };
        const label = options.title || route.name;
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[
              styles.tabButton,
              { width: TabWidth, gap: 8 },
              isFocused && styles.tabButtonActive,
            ]}
          >
            <AppText
              style={[styles.tabText, isFocused && styles.activeTabText]}
            >
              {label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const InvoiceStack = createNativeStackNavigator();

const Invoice = () => {
  return (
    <InvoiceStack.Navigator screenOptions={{ headerShown: false }}>
      <InvoiceStack.Screen
        name={Screens.InvoiceMain}
        component={InvoiceScreen}
      />
      <InvoiceStack.Screen
        name={Screens.GenerateInvoice}
        component={GenerateInvoiceScreen}
      />
      <InvoiceStack.Screen
        name={Screens.InvoiceDetail}
        component={InvoiceDetailScreen}
      />
    </InvoiceStack.Navigator>
  );
};

const HisStack = createNativeStackNavigator();

const HistoryNavigation = () => {
  return (
    <HisStack.Navigator screenOptions={{ headerShown: false }}>
      <HisStack.Screen name={Screens.History} component={HistoryScreen} />
      <HisStack.Screen
        name={Screens.InvoiceDetail}
        component={InvoiceDetailScreen}
      />
    </HisStack.Navigator>
  );
};

const AuthStack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={Screens.Login} component={LoginScreen} />
      <AuthStack.Screen name={Screens.Register} component={SignupScreen} />
      <AuthStack.Screen name={Screens.Verify} component={VerifyOtpScreen} />
    </AuthStack.Navigator>
  );
};

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name={Routes.Home}
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name={Routes.Invoice}
        component={Invoice}
        options={{ title: "Invoice", unmountOnBlur: true }}
      />
      <Tab.Screen
        name={Routes.History}
        component={HistoryNavigation}
        options={{ title: "History", unmountOnBlur: true }}
      />
      <Tab.Screen
        name={Routes.Report}
        component={ReportScreen}
        options={{ title: "Report", unmountOnBlur: true }}
      />
    </Tab.Navigator>
  );
};

interface HomeStackProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, "BottomTabs">;
}

const HomeStack: React.FC<HomeStackProps> = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          title: "Home",
          header: () => <CustomHeader navigation={navigation as any} />,
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerStack: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: "100%" },
      }}
      drawerContent={(props) => <FullScreenDrawer {...props} />}
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const RootStack = createNativeStackNavigator();

const RootNavigation = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
{ /* const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.login(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb25nb2lkIjoiNjdkODU2MWMwNzQ3NjY0ZDg0YTkwYTQ3IiwiaWF0IjoxNzQ1MTQ2ODEwLCJleHAiOjE3NzY2ODI4MTB9.4pUQurtmNXpMgaRi5yZuzUU-2Upvysd96X3FSEj8ZzQ`));     
  }, [])
 
console.log("-==---==--=", isAuthenticated); */
}

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={DrawerStack} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigation} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    backgroundColor: StaticColors.primary,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  menuButton: {
    padding: 10,
  },
  logo: {
    width: 90,
    height: 42,
    marginTop: 5,
  },
  tabBarContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    height: 60,
    backgroundColor: StaticColors.white,
    borderTopWidth: 3,
    borderTopColor: StaticColors.lightGrey,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 5,
  },
  tabButton: {
    backgroundColor: StaticColors.white,
    alignItems: "center",
    justifyContent: "center",
    height: 34,
    borderColor: StaticColors.lightGrey,
    borderWidth: 0.5,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
  },
  tabButtonActive: {
    backgroundColor: StaticColors.primary,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 14,
    color: StaticColors.black,
  },
  activeTabText: {
    color: StaticColors.white,
    fontWeight: "bold",
  },
});
