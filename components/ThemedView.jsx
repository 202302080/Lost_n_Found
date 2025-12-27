import { View, useColorScheme } from 'react-native'
import  { colors }   from "../constants/colors"

const ThemedView = ({ style, ...props }) => {
    const colorScheme = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light   

  return (
    
    <View 
    style={[{ backgroundColor: theme.background}, style]}
    {...props}
    />
  )
}

export default ThemedView
