import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainContent from "../Screens/MainContent";
import axios from "axios";
import API_URL from "../Defaults/Constants";

const Tab = createBottomTabNavigator();



export default BottomTabNavigator = () => {

    const [categories, setCategories] = useState([])
    const [tabOptions, setTabOptions] = useState({});
    useEffect(() => {
        const cancleToken = axios.CancelToken.source().token;
        axios.get(`${API_URL}/api/v1/categories?paginate=false`, { cancleToken }).then(response => {
            const response_array = [...response.data.data]
            response_array.map(data => {
                if (data.name == 'Phone') {
                    data.options = {
                        tabBarLabel: 'Phones',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="smartphone" color={color} size={size} />
                        ),
                    }
                }
                else if (data.name == 'Tablet') {
                    data.options = {
                        tabBarLabel: 'Tablets',
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="tablet1" color={color} size={size} />
                        ),
                    }
                }
                else if (data.name == 'Watch') {
                    data.options = {
                        tabBarLabel: 'Watches',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="watch-variant" color={color} size={size} />
                        ),
                    }
                }
            })
            setCategories(response_array)

        }).catch(error => {
            if (axios.isCancel(error)) {
                console.log('dismounted');
            }
            else {
                console.log(error.response.status)

            }
        }
        )
    }, [])


    if (categories.length > 0) {
        return (
            <Tab.Navigator>
                {
                    categories.map(category => (
                        <Tab.Screen
                            key={category.id}
                            name={category.name}
                            component={MainContent}
                            initialParams={{ category_id: category.id }}
                            options={category.options}
                        />
                    ))
                }
                {/* <Tab.Screen
                    name="Phones"
                    component={MainContent}
                    initialParams={{ category: 'phones' }}
                    options={{
                        tabBarLabel: 'Phones',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="smartphone" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Tablets"
                    component={MainContent}
                    initialParams={{ category: 'tablets' }}
                    options={{
                        tabBarLabel: 'Tablets',
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="tablet1" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Watches"
                    component={MainContent}
                    initialParams={{ category: 'phone' }}
                    options={{
                        tabBarLabel: 'Watches',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="watch-variant" color={color} size={size} />
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
    else {
        return (
            null
        )
    }
};
