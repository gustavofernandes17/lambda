import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';


import Home from '../screens/Home';
import Explorer from '../screens/Explorer';
import theme from '../styles/theme';

const Tab = createMaterialTopTabNavigator()

const TopTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarLabelStyle: {
          fontWeight: '600'
        },
        tabBarStyle: {
          elevation: 0
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarIndicatorStyle: {backgroundColor: theme.colors.primary},
      }}
    >
      <Tab.Screen name='Músicas' component={Home} />
      <Tab.Screen name='Explorer' component={Explorer}/>
    </Tab.Navigator>
  );
}

export default TopTabNavigator;