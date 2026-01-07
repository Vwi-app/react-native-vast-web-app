import * as toolkitRaw from '@reduxjs/toolkit';
const { createSlice } = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw;

const initialState = {
  authToken: '',
  refreshToken: '',
  userId: '',
  Mpin: '',  // Merged from second code
  appLanguage: 'en', // ✅ ADD THIS LINE
  activeAepsLine: null, // 'aeps1' or 'aeps2'  
  colorConfig: {
    primaryColor: '#3A7DFF',
    secondaryColor: '#9D5B87',
    primaryButtonColor: '#F1C40F',
    secondaryButtonColor: '#E74C3C',
    labelColor: '#2ECC71'
  },
  Loc_Data: {
    let: null,
    long: null,
    isGPS: null
  },
  versionData: {},
  isFingerprintEnabled: false,
  dashboardData: {},
  sliderImageData: [],
  needUpdate: true,
  IsDealer: false,
  IsRington: true,
  IsOnLoc: false,
  latitude: '0',
  longitude: '0',
  rceIdStatus: {
    status: null,
    status2: null
  },
  fcmToken: '',
  cmsVerify: false,
  rctype: null,
  rcPrePayAnomut: null,
  cmsAddMFrom: null,
  radiantList: null,
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },

    clearEntryScreen: (state, action) => {
      state.cmsAddMFrom = null;
    },
    setRadiantList: (state, action) => {
      state.radiantList = action.payload;
    },
    setCmsAddMFrom: (state, action) => {
      state.cmsAddMFrom = action.payload;
    },

    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },

    setRctype: (state, action) => {
      state.rctype = action.payload;
    },

    setRcPrePayAnomut: (state, action) => {
      state.rcPrePayAnomut = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setMpin: (state, action) => {
      state.Mpin = action.payload;
    },
    setColorConfig: (state, action) => {
      state.colorConfig = action.payload;
    },
    setLoc_Data: (state, action) => {
      state.Loc_Data = action.payload;
    },
    setFingerprintStatus: (state, action) => {
      state.isFingerprintEnabled = action.payload;
    },
    setVersionData: (state, action) => {
      state.versionData = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setSliderImageData: (state, action) => {
      state.sliderImageData = action.payload;
    },
    setNeedUpdate: (state, action) => {
      state.needUpdate = action.payload;
    },
    setIsDealer: (state, action) => {
      state.IsDealer = action.payload;
    },
    setIsRington: (state, action) => {
      state.IsRington = action.payload;
    },
    setIsOnLoc: (state, action) => {
      state.IsOnLoc = action.payload;
    },
    setLatitude: (state, action) => {
      state.latitude = action.payload;
    },
    setLongitude: (state, action) => {
      state.longitude = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setRceIdStatus: (state, action) => {
      state.rceIdStatus = action.payload;
    },
    setAppLanguage: (state, action) => {
      state.appLanguage = action.payload;
    },
    setCmsVerify: (state, action) => {
      state.cmsVerify = action.payload;
    },
    setActiveAepsLine: (state, action) => {
      state.activeAepsLine = action.payload;
    },
    reset: () => JSON.parse(JSON.stringify(initialState)),
  },
});

export const {
  setAuthToken,
  setRefreshToken,
  setUserId,
  setMpin,
  setColorConfig,
  setLoc_Data,
  setFingerprintStatus,
  setVersionData,
  setDashboardData,
  setSliderImageData,
  setNeedUpdate,
  setIsDealer,
  setIsRington,
  setIsOnLoc,
  setLatitude,
  setLongitude,
  setFcmToken,
  setRceIdStatus,
  setAppLanguage,
  setCmsVerify,
  reset,
  setActiveAepsLine,
  setRctype,
  setRcPrePayAnomut,
  setCmsAddMFrom,
  setRadiantList,
  clearEntryScreen,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
