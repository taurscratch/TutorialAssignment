import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationStack } from './Navigation/stacks';
export default App = () => {
  return (
    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  )
}
