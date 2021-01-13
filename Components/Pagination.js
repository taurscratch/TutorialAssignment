import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

const Pagination = ({ data, index }) => {

    useEffect(() => {
        console.log({ index })
    }, [])

    return (
        <View style={styles.pagination} pointerEvents="none">
            {data.map((_, i) => {
                return (
                    <View
                        key={i}
                        style={[
                            styles.paginationDot,
                            index === i
                                ? styles.paginationDotActive
                                : styles.paginationDotInactive,
                        ]}
                    />
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    pagination: {
        bottom: 20,
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    paginationDotActive: { backgroundColor: "lightblue", width: 20 },
    paginationDotInactive: { backgroundColor: "gray" },

})

export { Pagination };