import React from "react";
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import Detail from '../Screens/Detail';
import BottomTabNavigator from './navigators';
import Search from "../Screens/Search";
const Stack = createStackNavigator();

const NavigationStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'rgb(183, 228, 199)'
                },
                headerTintColor: 'white',

            }}
        >
            <Stack.Screen
                name="index"
                component={BottomTabNavigator}
                options={{
                    title: 'Tutorial Assignment',
                    headerTitleStyle: {
                        textAlign: 'center'
                    }
                }}
            />
            <Stack.Screen
                name="phone_detail"
                component={Detail}
                options={({ navigation, route }) => ({
                    title: `${route.params.phone_obj.name}'s Detail`,
                    // headerLeft: (<HeaderBackButton onPress={() =>{ navigation.navigate('index')}} />)
                })}
            />
            <Stack.Screen
                name="search"
                component={Search}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}
export { NavigationStack };

