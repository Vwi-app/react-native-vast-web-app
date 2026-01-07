import React, { useCallback, useEffect, useState } from 'react';
import { View, Dimensions, Text } from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { SvgUri } from 'react-native-svg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { colors } from '../../../utils/styles/theme';

const { width: screenWidth } = Dimensions.get('window');

const CarouselView = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [sliderImages, setSliderImages] = useState([]);
  const { get } = useAxiosHook();

  useEffect(() => {
    const fetchData = async () => {
      const res = await get({
        url: APP_URLS.getSliderImages,
      });
      console.log('res', res);
      if (res) {
        setSliderImages(res || []);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={{ alignItems: 'center' }}>
      <Carousel
        data={sliderImages}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        autoplay={true}
        renderItem={({ item }) => (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              marginBottom: hScale(8),
              marginTop: hScale(8),
              paddingHorizontal: wScale(10),
            }}
          >
            {item.images ? (
              <SvgUri
                width="100%"
                height={172}
                uri={item.images}
              />
            ) : (
              <Text>Image not available</Text> 
            )}
          </View>
        )}
        onSnapToItem={index => {
          setActiveSlide(index);
        }}
      />
      <Pagination
        dotsLength={sliderImages.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          position: 'absolute',
          bottom: hScale(-20), // Image ke bottom se 10 pixel niche
          alignSelf: 'center', // Center align karna
          padding: 0,
          borderRadius: 20,
        }}
        dotStyle={{
          width: wScale(20),
          height: hScale(7),
          borderRadius: 5,
          backgroundColor: colors.white,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

export default CarouselView;
