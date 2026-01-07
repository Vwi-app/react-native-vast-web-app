import React, {useCallback, useRef} from 'react';

import {
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  View,
  ViewProps,
  Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import {SCREEN_WIDTH, wScale, SCREEN_HEIGHT} from '../utils/styles/dimensions';
import useKeyboardEvent from '../hooks/useKeyboardEvent';
import {colors} from '../utils/styles/theme';

export interface BottomViewProps extends ViewProps {
  onClose?: any;
  children?: React.ReactNode;
  hasCloseButton?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  hasHandleBar?: boolean;
  closeOnBackdropPress?: boolean;
}

const BottomView = ({
  children,
  onClose,
  hasCloseButton,
  containerStyle,
  hasHandleBar,
  bodyStyle,
  closeOnBackdropPress = true,
  ...props
}: BottomViewProps) => {
  const didMount = useRef(false);
  const animateRef = useRef<Animatable.View & View>(null);
  const keyboardEvent = useKeyboardEvent();

  const close = useCallback(() => {
    if (didMount.current && animateRef?.current?.slideOutDown) {
      animateRef.current.slideOutDown(400);
    }
    // The backdrop will not removed if we put this callback inside slideOutDown callback
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Pressable
      onPress={() => {
        if (closeOnBackdropPress && onClose) {
          onClose();
        }
      }}
      style={[styles.modal, containerStyle, {height: SCREEN_HEIGHT}]}>
      <TouchableWithoutFeedback>
        <Animatable.View
          ref={animateRef}
          animation="slideInUp"
          duration={400}
          useNativeDriver
          style={[
            styles.container,
            bodyStyle,
            {
              paddingBottom:
                (keyboardEvent?.endCoordinates?.height || 0) + wScale(24),
            },
          ]}
          onAnimationEnd={() => {
            didMount.current = true;
          }}
          {...props}>
          {hasHandleBar && (
            <View style={styles.handleBarContainer}>
              <Pressable onPress={close} style={styles.handleBar} />
            </View>
          )}
          {children}
          {hasCloseButton && (
            <Pressable onPress={close} style={styles.close}>
              <Text> {'Close'}</Text>
            </Pressable>
          )}
        </Animatable.View>
      </TouchableWithoutFeedback>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: SCREEN_WIDTH,
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: colors.tinted_grey,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: wScale(24),
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: wScale(24),
    right: wScale(24),
  },
  handleBar: {
    width: wScale(44),
    height: wScale(4),
    borderRadius: wScale(4),
    backgroundColor: colors.tinted_grey,
  },
  handleBarContainer: {
    padding: wScale(6),
    position: 'absolute',
  },
});

export default React.memo(BottomView);
