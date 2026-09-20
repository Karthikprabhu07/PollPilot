import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

let app;
let auth;
let googleProvider;
let isInitializing = false;

// We fetch the configuration dynamically because PollPilot is hosted on Firebase Hosting
// which automatically serves /__/firebase/init.json with the correct keys.
export const initFirebase = async () => {
  if (auth) return auth;
  if (isInitializing) {
    // wait for it
    while (!auth) {
      await new Promise(r => setTimeout(r, 100));
    }
    return auth;
  }
  
  isInitializing = true;
  try {
    const response = await fetch('/__/firebase/init.json');
    if (!response.ok) throw new Error("Could not load init.json");
    const config = await response.json();
    
    app = initializeApp(config);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    return auth;
  } catch (error) {
    console.warn("Firebase config not found at /__/firebase/init.json. This usually happens in local dev environment.", error);
    // Provide a dummy auth object for local dev so the app doesn't completely crash
    auth = {
      dummy: true,
      currentUser: { uid: 'local-dev-uid', displayName: 'Local Dev User', email: 'dev@local.com' },
      onAuthStateChanged: (callback) => {
        callback({ uid: 'local-dev-uid', displayName: 'Local Dev User', email: 'dev@local.com' });
        return () => {};
      },
      signOut: async () => {}
    };
    return auth;
  }
};

export const signInWithGoogle = async () => {
  if (!auth) await initFirebase();
  if (auth.dummy) return auth.currentUser;
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logout = async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export { auth };
