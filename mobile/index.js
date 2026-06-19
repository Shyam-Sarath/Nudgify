import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';

import App from './App';

// #region agent log
fetch('http://127.0.0.1:7325/ingest/ec45b7eb-196d-4933-afd3-e540532f9309',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'78bd0c'},body:JSON.stringify({sessionId:'78bd0c',runId:'initial',hypothesisId:'E',location:'mobile/index.js:startup',message:'Mobile app bootstrap',data:{sdkVersion:Constants.expoConfig?.sdkVersion||null,appOwnership:Constants.appOwnership||null,executionEnvironment:Constants.executionEnvironment||null},timestamp:Date.now()})}).catch(()=>{});
// #endregion

registerRootComponent(App);
