import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from 'react-native-alert-notification';

const DynamicButton = ({ title, onPress, styleoveride }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const handlePress = () => {

    onPress();
  };

  return (
    <View>

      <LinearGradient
        style={[styles.LinearGradient, styleoveride]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={[colorConfig.primaryButtonColor, colorConfig.secondaryButtonColor]}>
        <TouchableOpacity onPress={handlePress} style={[styles.subnitbtn]}>
          <Text style={[styles.submittext, { color: colorConfig.labelColor }]}>
            {title}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <AlertNotificationRoot>

      </AlertNotificationRoot>


    </View>
  );
};

const styles = StyleSheet.create({
  subnitbtn: {
    alignItems: 'center',
    height: hScale(55),
    justifyContent: 'center',
    borderRadius: wScale(5),

  },
  submittext: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  LinearGradient: {
    width: '100%',
    borderRadius: wScale(5),
  },
});
export default DynamicButton;
