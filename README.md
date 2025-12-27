Expo Manual Installation

Step 1: Install Expo Router
npx create-expo-app@latest --template ./

Step 2: Install dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

Step 3: App.json
you can see a expo inside the file, put "scheme": "lostnfound", above the "name": "LostnFound". The " " are included

Step 4: Package.json
change main: index.js to "main": "expo-router/entry",

Step 5: For Icon
npm install @expo/vector-icons

Step 5: Run App
npx expo start
