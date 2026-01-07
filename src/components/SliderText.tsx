import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marquee } from '@animatereactnative/marquee';
import { hScale, wScale } from '../utils/styles/dimensions';
import { RootState } from '../reduxUtils/store';
import { useSelector } from 'react-redux';

const NewsSlider = ({ data }) => {
    const { colorConfig, } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}75`;
    return (
        <View style={styles.container}>
            <Marquee spacing={0} speed={1}>
                <View style={styles.scrollContainer}>

                    {data.map((item, index) => (
                        <View key={index} style={[styles.itemContainer,]}>
                            <Text style={[styles.itemText, { }]}>{item.App_Message}</Text>
                        </View>
                    ))}
                </View>

            </Marquee>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor:'#fff',
        marginBottom:hScale(5),
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemContainer: {
        marginHorizontal: wScale(10),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        paddingVertical:hScale(2)
    },
    itemText: {
        fontSize: wScale(16),
        letterSpacing: 0.1,
        paddingHorizontal: wScale(10),
        color: '#000',
    },
});

export default NewsSlider;
