import { ExpoConfig, ConfigContext } from "expo/config";

const verStr = "1.0"; // Ensure version string is explicitly a string
const ver = 1; // Ensure versionCode is an integer

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "KDX",
  slug: "kdx",
  scheme: "kdx",
  version: verStr,
  jsEngine: "hermes",
  orientation: "portrait",
  icon: "./assets/icon.png",
  primaryColor: "#0068E0",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#0068E0",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: "35.0.0",
        },
        ios: {
          deploymentTarget: "15.1",
        },
      },
    ],
    [
      "react-native-share",
      {
        ios: ["fb", "instagram", "twitter", "tiktoksharesdk"],
        android: [
          "com.facebook.katana",
          "com.instagram.android",
          "com.twitter.android",
          "com.zhiliaoapp.musically",
        ],
        enableBase64ShareAndroid: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you share them with your friends."
      }
    ]
  ],
  ios: {
    bundleIdentifier: "com.app.kdx",
    buildNumber: verStr,
    supportsTablet: true,
  },
  android: {
    package: "com.app.kdx",
    versionCode: ver,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
});
