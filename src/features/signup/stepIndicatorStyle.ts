import {wScale} from '../../utils/styles/dimensions';
import {colors} from '../../utils/styles/theme';

export const StepIndicatorStyle = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 34,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#7eaec4',//colorConfig.secondary
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#7eaec4',//colorConfig.secondary
  stepStrokeUnFinishedColor: '#dedede',
  separatorFinishedColor: '#7eaec4',//colorConfig.secondary
  separatorUnFinishedColor: '#dedede',
  stepIndicatorFinishedColor: '#7eaec4',//colorConfig.secondary
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: wScale(15, 1),
  currentStepLabelColor: colors.dark_blue,//colorConfig.secondary
};
