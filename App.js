import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import PhoneDetail from './PhoneDetail';
import Phones from './Phones';

const Stack = createStackNavigator();

export default App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="phones"
          component={Phones}
          options={{ title: 'Phones' }}
        />
        <Stack.Screen
          name="phone_detail"
          component={PhoneDetail}
          options={({ route }) => ({ title: `${route.params.phone_obj.name}'s Detail` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    // <Phones />
  )
}
