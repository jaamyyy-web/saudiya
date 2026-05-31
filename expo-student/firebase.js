import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';

let asyncStoragePersistence = null;
try {
  const AsyncStorageModule = require('@react-native-async-storage/async-storage');
  const AsyncStorage = AsyncStorageModule.default || AsyncStorageModule;
  asyncStoragePersistence = getReactNativePersistence(AsyncStorage);
} catch {
  // AsyncStorage not available — auth will use in-memory persistence
}

const firebaseConfig = {
  apiKey: 'AIzaSyBscnKyw3dldC7UudkzDd3XNBWRFxr9ZM0',
  authDomain: 'saudiedu-3fe68.firebaseapp.com',
  projectId: 'saudiedu-3fe68',
  storageBucket: 'saudiedu-3fe68.firebasestorage.app',
  messagingSenderId: '520109867273',
  appId: '1:520109867273:web:1cf56b39896f81205293d8',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);

let _auth;
try {
  if (getApps().length === 1 && asyncStoragePersistence) {
    _auth = initializeAuth(app, { persistence: asyncStoragePersistence });
  } else {
    _auth = getAuth(app);
  }
} catch {
  _auth = getAuth(app);
}

export const auth = _auth;
export { app };

