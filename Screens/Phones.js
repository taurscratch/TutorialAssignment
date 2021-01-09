import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import API_URL from '../Defaults/Constants';


export default Phones = ({ navigation, props }) => {

    // const [phones, setPhones] = useState([
    //     { id: 1, color: 'grey' },
    //     { id: 2, color: 'grey' },
    //     { id: 3, color: 'grey' },
    //     { id: 4, color: 'grey' },
    //     { id: 5, color: 'grey' },
    //     { id: 6, color: 'grey' },
    //     { id: 7, color: 'grey' },
    //     { id: 8, color: 'grey' },
    //     { id: 9, color: 'grey' },
    //     { id: 10, color: 'grey' },

    // ]);
    const [phones, setPhones] = useState([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [end_of_data, setEndOfData] = useState(false);
    const [search_string, setSearchString] = useState('')
    useEffect(() => {
        getPhones();
    }, [])

    const getPhones = (name = '', page = '') => {
        const cancleToken = axios.CancelToken.source().token;
        if (name == '' && page == '') {
            axios.get(`${API_URL}/api/v1/brand/1/phones`, { cancleToken }).then(response => {
                setPhones(response.data.data)
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
                if (page > lastPage) {
                    console.log(page, lastPage)
                    setEndOfData(true)
                }
                else {
                    axios.get(`${API_URL}/api/v1/brand/1/phones?page=${page}`, { cancleToken }).then(response => {
                        let phone_array = phones;
                        phone_array = [...phone_array, ...response.data.data]
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

    }

    const renderContent = ({ item }) => {
        if (item.key != 'empty') {
            return (
                <View style={item.key === 'empty' ? [styles.item, styles.itemInvisible] : styles.item}>
                    <Image
                        resizeMode='contain'
                        style={{ width: '60%', height: '60%' }}
                        source={{ uri: item.photo[0] }}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Button
                        onPress={() => handleOnPress(item)}
                        title="View"
                        color="grey"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>
            )
        }
    }


    return (
        <View style={styles.container}>
            <TextInput
                inlineImageLeft='search_icon'
                inlineImagePadding={20}
                style={{ margin: 20, borderRadius: 15, backgroundColor: 'white' }}
                onChangeText={text => onChangeText(text)}
                value={search_string}
            />
            <FlatList
                data={formatData(phones)}
                renderItem={renderContent}
                // style={styles.container}
                keyExtractor={phone => phone.id.toString()}
                onEndReached={() => getPhones('', page)}
                onEndReachedThreshold={0.5}
                numColumns={2}
                ListFooterComponent={end_of_data && (<Text>End of data</Text>)}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
    },
    item: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        // width: Dimensions.get('window').width / 2,
        flex: 1,
        margin: 5,
        height: Dimensions.get('window').width, // approximate a square
        // height: 500, // approximate a square

    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        textAlign: 'center',
        color: 'black',
        marginBottom: 20,
        alignContent: 'center'
    },
});