import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function resolveApiUrl() {
  const configured =
    Constants.expoConfig?.extra?.apiUrl ||
    process.env.EXPO_PUBLIC_API_URL ||
    'http://localhost:5001';

  if (Platform.OS === 'android' && configured.includes('localhost')) {
    return configured.replace('localhost', '10.0.2.2');
  }

  return configured;
}

export const API_URL = resolveApiUrl();

// #region agent log
fetch('http://127.0.0.1:7325/ingest/ec45b7eb-196d-4933-afd3-e540532f9309',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'78bd0c'},body:JSON.stringify({sessionId:'78bd0c',runId:'initial',hypothesisId:'C',location:'mobile/src/config/api.js:resolveApiUrl',message:'Resolved mobile API URL',data:{platform:Platform.OS,apiUrl:API_URL,configuredExtra:Constants.expoConfig?.extra?.apiUrl||null},timestamp:Date.now()})}).catch(()=>{});
// #endregion

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default apiClient;
