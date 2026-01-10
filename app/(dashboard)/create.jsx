import { View } from 'react-native';

// This component is required by Expo Router to create the route,
// but the user will never see it because we intercept the click 
// in _layout.jsx to open the modal instead.
export default function CreatePlaceholder() {
  return <View style={{ flex: 1, backgroundColor: 'white' }} />;
}

