import { DefaultTheme } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'

const theme: Theme = {
  ...DefaultTheme, 
  colors: {
    ...DefaultTheme.colors, 
    primary: '#473BF0',
    accent: '#E31A5F',
  }  
}

export default theme