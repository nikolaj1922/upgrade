import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtqGdq1bdrwe2j6Z3t9CNCrGTKpgzSxu4",
  authDomain: "upgrade-2f00c.firebaseapp.com",
  projectId: "upgrade-2f00c",
  storageBucket: "upgrade-2f00c.appspot.com",
  messagingSenderId: "360158364280",
  appId: "1:360158364280:web:6fcb005f49e068f9e1638d",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth();

export default app;
export { auth };
