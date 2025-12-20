# Lost_n_Found
This is manual installation

*Step 1: Install expo* 
npx create-expo-app@latest --template blank ./

*Step 2: Install dependencies*
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

*Step 3: App.json*
you can see expo, inside put "scheme": lostnfound,

*Step 4: Package.json*
change "main": index.js to main": expo-router/entry

*Step 5: Run app*
npx expo start
