// lib/firebase.js
// Firebase Auth + Firestore — ข้อมูลลูกค้าปลอดภัย
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

// ─── Init Firebase (ใช้ Environment Variables เท่านั้น) ─────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── Auth Functions ──────────────────────────────────────────

// สมัคร/เข้าสู่ระบบด้วยอีเมล
export async function signInEmail(email, password) {
  try {
    // พยายาม login ก่อน
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, isNew: false };
  } catch (err) {
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      // ถ้าไม่มี account → สร้างใหม่
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, isNew: true };
    }
    throw err;
  }
}

// เข้าสู่ระบบด้วย Google
export async function signInGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return { user: result.user };
}

// ออกจากระบบ
export async function signOut() {
  return fbSignOut(auth);
}

// ดู auth state
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── Firestore Functions (ข้อมูล scoped per user) ────────────

// บันทึกโปรไฟล์
export async function saveProfile(uid, data) {
  // เขียนเฉพาะ path /users/{uid} — Firestore rules จำกัดสิทธิ์แล้ว
  await setDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ดึงโปรไฟล์
export async function getProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

// บันทึกคำตอบแบบประเมิน
export async function saveAnswers(uid, answers) {
  await setDoc(doc(db, "users", uid, "answers", "latest"), {
    answers,
    completedAt: serverTimestamp(),
  });
}

// ดึงคำตอบ
export async function getAnswers(uid) {
  const snap = await getDoc(doc(db, "users", uid, "answers", "latest"));
  return snap.exists() ? snap.data() : null;
}

// บันทึกคะแนน + ผล AI
export async function saveResults(uid, scores, aiData) {
  await setDoc(doc(db, "users", uid), {
    scores,
    aiData,
    resultsAt: serverTimestamp(),
  }, { merge: true });
}

// บันทึกการซื้อ
export async function savePurchase(uid, plan, stripeSessionId) {
  await setDoc(doc(db, "users", uid, "purchases", plan), {
    plan,
    stripeSessionId,
    purchasedAt: serverTimestamp(),
  });
  // อัพเดท plan ใน profile ด้วย
  await setDoc(doc(db, "users", uid), { plan }, { merge: true });
}

// ดึง plan ปัจจุบัน
export async function getPlan(uid) {
  const profile = await getProfile(uid);
  return profile?.plan || "free";
}
