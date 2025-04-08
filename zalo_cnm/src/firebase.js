import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiZ6ukrlkNTNjZ81ecZFMEZd_MSi9ZLiQ",
  authDomain: "zaloauth-6942d.firebaseapp.com",
  projectId: "zaloauth-6942d",
  storageBucket: "zaloauth-6942d.appspot.com", // ✅ Đã sửa
  messagingSenderId: "1057786411090",
  appId: "1:1057786411090:web:b526d90a630513bc65478b",
  measurementId: "G-YKNT54RHXJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
