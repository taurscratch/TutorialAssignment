import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import API_URL from './Constants';


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
    useEffect(() => {
        getPhones();
    }, [])

    useEffect(() => {

    }, [phones])

    const getPhones = (name = '', page = '') => {
        const cancleToken = axios.CancelToken.source().token;
        if (name == '' && page == '') {
            axios.get(`${API_URL}/api/v1/brand/1/phones`, { cancleToken }).then(response => {
                setPhones(response.data.data)
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
                console.log('end')
                page++;
                axios.get(`${API_URL}/api/v1/brand/1/phones?page=${page}`, { cancleToken }).then(response => {
                    let phone_array = phones;
                    phone_array = [...phone_array, ...response.data.data]
                    console.log(phone_array)
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

    const renderContent = ({ item }) =>
    (
        <View style={item.key === 'empty' ? [styles.item, styles.itemInvisible] : styles.item}>
            {item.key === 'empty' ? null :
                (
                    <Image style={{ width: '50%', height: '50%' }} source={{ uri: item.photo[0] }} />
                )}
            <Text style={styles.itemText}>{item.name}</Text>
            {item.key === 'empty' ? null :
                (
                    <Button
                        onPress={() => handleOnPress(item)}
                        title="View"
                        color="grey"
                        accessibilityLabel="Learn more about this purple button"
                    />)}
        </View>

    )

    return (
        <View>
            <FlatList
                data={formatData(phones)}
                renderItem={renderContent}
                keyExtractor={phone => phone.id.toString()}
                onEndReached={() => getPhones('', page)}
                onEndReachedThreshold={0.5}
                numColumns={2}
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
        aspectRatio: 1,
        flex: 1 / 2,
        margin: 10,
        // height: Dimensions.get('window').width / 2, // approximate a square
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
    itemText: {
        color: 'black',
    },
});