import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Text, TextInput, View, StyleSheet, FlatList, Dimensions, TouchableHighlight, Image } from 'react-native'
import API_URL from '../Defaults/Constants'



export default Search = ({ navigation, route }) => {

    const [search_string, setSearchString] = useState('')
    const [search_result, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [autoCompleteView, setAutoCompleteView] = useState(false)
    const getData = (name = '') => {
        setLoading(true)
        const cancleToken = axios.CancelToken.source().token;
        axios.get(`${API_URL}/api/v1/brand/1/phones?name=${name}`, { cancleToken }).then(response => {
            let array = [...response.data.data];
            array.map(phone => {
                phone.photo.length == 0 ? phone.image_uri = require('../Defaults/fallback_image.png')
                    :
                    phone.image_uri = { uri: phone.photo[0] }

            })
            setSearchResult(array)
            setAutoCompleteView(true)
            setLoading(false)

        }).catch(error => {
            if (axios.isCancel(error)) {
                console.log('dismounted');
            }
            else {
                console.log(error.response.status)
            }
        }
        )
    }

    const handleTextInput = (value) => {
        setSearchString(value)
        getData(value)
    }
    const loadFallBackImage = (item_id) => {
        let phone_array = [...phones];
        phone_array[phone_array.findIndex(phone => phone.id === item_id)].image_uri = require('../Defaults/fallback_image.png')
        setPhones(phone_array)
    }

    const navigate = (item_obj) => {
        navigation.navigate('phone_detail', { phone_obj: item_obj })
    }

    const renderContent = ({ item }) => {
        return (
            <TouchableHighlight onPress={() => navigate(item)}>
                {/*  <TouchableHighlight onPress={() => console.log(item)}> */}

                <View style={styles.autoCompleteContainer}>
                    <Image
                        resizeMode='contain'
                        style={{ width: 50, height: 50 }}
                        source={item.image_uri}
                        onError={() => loadFallBackImage(item.id)}
                    />
                    <Text style={styles.automCompleteText}>{item.name}</Text>
                </View>
            </TouchableHighlight>

        )
    }

    return (
        <View>
            <TextInput
                autoFocus={true}
                inlineImageLeft='search_icon'
                inlineImagePadding={20}
                style={{ margin: 10, borderRadius: 15, height: 50, backgroundColor: 'white', zIndex: 9 }}
                onChangeText={text => handleTextInput(text)}
                value={search_string}
            />
            {search_string != '' && (
                <FlatList
                    data={search_result}
                    style={{
                        width: Dimensions.get('window').width - 20,
                        height: 300,
                        backgroundColor: 'white',
                        top: 50,
                        margin: 10,
                        position: 'absolute',
                        zIndex: 8
                    }}
                    ListEmptyComponent={(<Text style={{ textAlign: 'center', }}>{`No results for ${search_string}`} </Text>)}
                    renderItem={({ item }) => renderContent({ item }, 'search')}
                    keyExtractor={phone => phone.id.toString()}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    autoCompleteContainer: {
        // flex: 1,
        backgroundColor: 'white',
        height: 60,
        // padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
    },
    automCompleteText: {
        textAlign: 'center',
        color: 'black',
        alignContent: 'center',
        flex: 1,
    }
})