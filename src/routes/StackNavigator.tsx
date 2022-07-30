import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import Settings from '../screens/Settings';
import TopTabNavigator from './TopTabNavigator';
import ApplicationHeader from '../components/ApplicationHeader';
import EditMusic from '../screens/EditMusic';
import { Music } from '../services/datasource';


type RootStackParamList = {
  App: undefined,
  Configurações: undefined
  EditMusic: Music[]
}

const Stack = createNativeStackNavigator<RootStackParamList>();


const StackNavigator: React.FC = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='App'
        component={TopTabNavigator}
        options={{
          header: (props) => <ApplicationHeader {...props}/>
        }}
      />
      <Stack.Screen name='Configurações' component={Settings}/>
      <Stack.Screen name='EditMusic' component={EditMusic} options={{
        headerShown: false
      }} />
    </Stack.Navigator>
  );
}

export default StackNavigator;