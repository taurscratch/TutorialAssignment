import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default PhoneDetail = ({ navigation, route }) => {

    const [phone, setPhone] = useState(route.params.phone_obj);

    useEffect(()=>{
        console.log(route.params.phone_obj)
    },[])

    return (
        <View>
            <Text>Hello.</Text>
        </View>
    )

}