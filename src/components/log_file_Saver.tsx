import { ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';


export const appendLog = async (message,name) => {
  console.log(name,'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  const LOG_FILE_PATH = `${RNFS.DownloadDirectoryPath}/${name}--login_debug_log.txt`;

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  try {
    await RNFS.appendFile(LOG_FILE_PATH, logMessage, 'utf8');
    //ToastAndroid.show('Log saved successfully', ToastAndroid.SHORT);  
  } catch (error) {
    console.log('Failed to write to log file:', error);
  //  ToastAndroid.show('Failed to save log file', ToastAndroid.LONG); 
  }
};

//export const getLogFilePath = () => LOG_FILE_PATH;
export const generateUniqueId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPart = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars[randomIndex];
  }

  const timestampPart = Date.now().toString(36); // base-36 timestamp
  const uniqueId = randomPart + timestampPart;

  return uniqueId; // final ID will be longer than length, but very unique
};
