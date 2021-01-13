import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View, TextInput, RefreshControl, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import useDebounce from '../Debounce';
import API_URL from '../Defaults/Constants';


export default MainContent = ({ navigation, route }) => {
    const [category_id, setCategoryId] = useState(route.params.category_id);
    const [phones, setPhones] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [end_of_data, setEndOfData] = useState(false);
    const [search_string, setSearchString] = useState('')
    const [loading, setLoading] = useState(true)
    const [nxt_page_loading, setNxtPageLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    // const debounce = useDebounce(search_string)

    //states
    useEffect(() => {
        console.log('mounted')
        // getPhones()
    }, [])

    useEffect(() => {
        if (refresh) {
            setEndOfData(false)
            setPhones([])
            getPhones();
        }
    }, [refresh])

    useEffect(() => {
        console.log('category_id changed')
        getPhones();
    }, [category_id])

    // useEffect(() => {
    //     getPhones(search_string)
    // }, [debounce])

    const getPhones = (name = '', page = '') => {
        console.log('get data')
        const cancleToken = axios.CancelToken.source().token;
        if (name == '' && page == '') {
            setLoading(true)
            axios.get(`${API_URL}/api/v1/brand/1/phones?category_id=${category_id}`, { cancleToken }).then(response => {
                let array = [...response.data.data];
                array.map(phone => {
                    phone.photo.length == 0 ? phone.image_uri = require('../Defaults/fallback_image.png')
                        :
                        phone.image_uri = { uri: phone.photo[0] }

                })
                setPhones(array)
                setPage(1)
                setRefresh(false)
                setLoading(false)
                setLastPage(response.data.meta.last_page)
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
        else {
            if (page != '') {
                page++;

                setNxtPageLoading(true)
                axios.get(`${API_URL}/api/v1/brand/1/phones?category_id=${category_id}&page=${page}`, { cancleToken }).then(response => {

                    let phone_array = phones;
                    let array = [...response.data.data];
                    array.map(phone => {
                        phone.photo.length == 0 ? phone.image_uri = require('../Defaults/fallback_image.png')
                            :
                            phone.image_uri = { uri: phone.photo[0] }

                    })
                    phone_array = [...phone_array, ...array]
                    setNxtPageLoading(false)
                    setPhones(phone_array)
                    setPage(page)
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
        }
    }

    const formatData = (data, columns = 2) => {
        let columnCount = columns;
        let lastRowGap = data.length % columnCount;

        while (lastRowGap !== columnCount && lastRowGap !== 0) {
            data.push({ id: lastRowGap, key: 'empty' })
            setPhones(data)
            lastRowGap++;
        }

        return data;
    }

    const handleOnPress = (value) => {
        navigation.navigate('phone_detail', { phone_obj: value });
    }

    const handleTextInput = (value) => {
        value == '' && setAutoCompleteView(false)
        setSearchString(value)
        getPhones(value)
    }

    const loadFallBackImage = (item_id) => {
        let phone_array = [...phones];
        phone_array[phone_array.findIndex(phone => phone.id === item_id)].image_uri = require('../Defaults/fallback_image.png')
        setPhones(phone_array)
    }

    const handleListEnd = (page_param) => {
        if (page_param != lastPage) {
            getPhones('', page_param)
        }
        else if (page_param >= lastPage) {
            setEndOfData(true)
        }
    }

    const renderContent = ({ item }, array_type = 'full') => {

        if (item.key != 'empty') {
            return (
                <View style={styles.item}>
                    <Image
                        resizeMode='contain'
                        style={{ width: '60%', height: '60%', flexGrow: 1 }}
                        source={item.image_uri}
                        onError={() => loadFallBackImage(item.id)}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                    <TouchableHighlight style={styles.itemBtn} underlayColor="rgb(82, 183, 136)" onPress={() => handleOnPress(item)}>
                        <Text style={styles.itemBtnText}>View</Text>
                    </TouchableHighlight>
                </View>
            )
        }
        else if (item.key == 'empty') {
            return (
                <View style={[styles.item, styles.itemInvisible]} />
            )
        }


    }

    if (loading) {
        return (<View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color='rgb(183, 228, 199)' /></View>)
    }
    else {
        return (
            <View style={styles.container}>
                <TextInput
                    inlineImageLeft='search_icon'
                    inlineImagePadding={20}
                    style={{ margin: 10, borderRadius: 15, height: 50, backgroundColor: 'white', zIndex: 9 }}
                    onChangeText={text => handleTextInput(text)}
                    onFocus={() => { navigation.navigate('search') }}
                    value={search_string}
                />
                <FlatList
                    refreshing={refresh}
                    // style={{ backgroundColor: 'cyan' }}
                    onRefresh={() => setRefresh(true)}
                    data={formatData(phones)}
                    renderItem={renderContent}
                    keyExtractor={phone => phone.id.toString()}
                    onEndReached={() => handleListEnd(page)}
                    onEndReachedThreshold={1}
                    numColumns={2}
                    ListFooterComponent={end_of_data ? (<Text style={{ textAlign: 'center', }}>End of data</Text>)
                        : nxt_page_loading ? ((<View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color='rgb(183, 228, 199)' /></View>))
                            : <View />
                    }
                />
            </View>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginVertical: 20,
        // backgroundColor: 'black',
        height: Dimensions.get('window').height,
        zIndex: 10
    },
  
    item: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        margin: 11,
        height: Dimensions.get('window').width / 1.3,

    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemImage: {
        width: '60%',
        height: '60%',
    },
    itemText: {
        textAlign: 'center',
        color: 'black',
        alignContent: 'center',
    },
    itemBtn: {
        // marginTop: 20,
        marginVertical: 20,
        backgroundColor: 'rgb(183, 228, 199)',
        width: (Dimensions.get('window').width / 2) / 2,
        height: '15%',
        borderRadius: 20,
        alignItems: 'center',
        textAlignVertical: 'center',
        justifyContent: 'center'
    },
    itemBtnText: {
        color: 'white'
    },
   
});