import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Pagination } from '../Components/Pagination';
import DefaultImage from '../Defaults/fallback_image.png';
export default Detail = ({ navigation, route }) => {

    const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
    const phone = route.params.phone_obj;
    const [images, setImages] = useState([{ id: 'fallback_image', uri: require('../Defaults/fallback_image.png') }])
    const [index, setIndex] = useState(0)
    const indexRef = useRef(index);
    indexRef.current = index;

    useEffect(() => {
        let image_array = phone.photo;
        let uri_array = []
        if (image_array.length > 0) {
            image_array.map((image, index) => uri_array.push({ id: `Image ${index + 1}`, uri: { uri: image } }))
            setImages(uri_array)
        }

    }, [])

    useEffect(() => {
        // console.log(images)
    }, [images])

    const loadFallBackImage = (item_id) => {
        let image_array = [...images]
        image[image_array.findIndex(image => image.id === item_id)].uri = require('../Defaults/fallback_image.png')
    }

    const onScroll = useCallback((event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        const distance = Math.abs(roundIndex - index);

        // Prevent one pixel triggering setIndex in the middle
        // of the transition. With this we have to scroll a bit
        // more to trigger the index change.
        const isNoMansLand = 0.4 < distance;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setIndex(roundIndex);
        }
    }, []);

    const renderContent = ({ item }) => {
        return (
            <View style={{
                height: windowHeight / 2,
                width: windowWidth - 40,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`
            }}>
                <Image resizeMode='contain' style={{ width: '50%', height: '50%', bottom: 30 }} source={item.uri} onError={() => loadFallBackImage(item.id)} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {images.length == 1 ? (
                <View style={{
                    width: windowWidth - 40,
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 0,
                    backgroundColor: `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`
                }}>
                    <Image resizeMode='contain' style={{ width: '50%', height: '50%' }} source={images[0].uri} onError={() => setImages([{ id: 'fallback_image', uri: require('../Defaults/fallback_image.png') }])} />
                </View>
            ) : (
                    <>
                        <FlatList
                            style={{ width: windowWidth - 40, height: windowHeight / 2, backgroundColor: 'black', flexGrow: 0 }}
                            data={images}
                            renderItem={renderContent}
                            keyExtractor={image => image.id}
                            horizontal
                            pagingEnabled
                            onScroll={onScroll}
                        // showsHorizontalScrollIndicator={false}
                        />
                        <Pagination index={index} data={images}></Pagination>
                    </>
                )}

            <ScrollView contentContainerStyle={styles.scrollViewContentContainer} style={styles.scrollViewContainer}>
                {[
                    { id: `name${phone.id}`, label: 'Name', value: phone.name },
                    { id: `display${phone.id}`, label: 'Display', value: phone.display },
                    { id: `battery_amount${phone.id}`, label: 'Battery', value: phone.battery_amount },
                    { id: `resolution${phone.id}`, label: 'Camera Resolution', value: `${phone.front_cam}/${phone.main_cam}` },
                    { id: `storage${phone.id}`, label: 'Storage', value: `${phone.rom}` },
                    { id: `memory${phone.id}`, label: 'Memory', value: `${phone.ram}` },

                ].map((text, index) => (
                    <Text key={text.id} style={styles.text}>{`${text.label}: ${text.value}`}</Text>
                ))}
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        margin: 20,
        flex: 1,
        alignItems: "center",
    },
    text: {
        padding: 19
    },
    scrollViewContainer: {
        width: Dimensions.get('window').width - 40,
        height: Dimensions.get('window').height / 2,
        // backgroundColor:'cyan'
    },
    scrollViewContentContainer: {
        alignItems: 'flex-start'
    }
})