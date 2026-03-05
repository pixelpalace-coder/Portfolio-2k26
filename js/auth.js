/* ========================================
   AUTH.JS — Firebase Auth (Email + Google)
   ======================================== */

// ──────────────────────────────────────────
// 🔥 FIREBASE CONFIG
// Replace these values with YOUR Firebase project config
// Firebase Console → Project Settings → Your apps → Web app → Config
// ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBhglVl4nxeQp_nHPsN-cuvSevHJt4BSsA",
  authDomain: "portfolio-7996a.firebaseapp.com",
  projectId: "portfolio-7996a",
  storageBucket: "portfolio-7996a.firebasestorage.app",
  messagingSenderId: "66714856469",
  appId: "1:66714856469:web:7bd406cee59520649af21c",
  measurementId: "G-DV2EW8YJPR"
};


// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  console.log('Project ID:', firebaseConfig.projectId);
} catch (err) {
  console.error('Firebase initialization error:', err);
}

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });



// Verify auth is ready
console.log('Auth object created:', !!auth);

const AUTH_KEY = 'sn_portfolio_auth';

/* ─── Auth Guard (portfolio.html) ─────── */
function authGuard() {
  const host = window.location.hostname || '';

  // On deployed/public hosts (Vercel, GitHub Pages, custom domain)
  // make the portfolio page publicly accessible (no login redirect).
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return;
  }

  // Local/dev: keep auth protection.
  if (sessionStorage.getItem(AUTH_KEY)) return;

  auth.onAuthStateChanged(user => {
    if (user) {
      sessionStorage.setItem(AUTH_KEY, 'true');
    } else {
      window.location.replace('index.html');
    }
  });
}

/* ─── Redirect helper after success ─── */
function onLoginSuccess(user) {
  sessionStorage.setItem(AUTH_KEY, 'true');
  if (user) {
    sessionStorage.setItem('sn_user_photo', user.photoURL || '');
    sessionStorage.setItem('sn_user_name', user.displayName || user.email || 'User');
    sessionStorage.setItem('sn_user_email', user.email || '');
  }

  // Set flag to play sound on next page load
  sessionStorage.setItem('play_login_sound', 'true');
  gsap.to('#login-page', {
    opacity: 0,
    duration: 0.45,
    ease: 'power2.inOut',
    onComplete: () => window.location.replace('portfolio.html')
  });
}

/* ─── Show error ────────────────────── */
function showError(msg) {
  const errorEl = document.getElementById('login-error');
  const card = document.querySelector('.login-card');
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.classList.add('show');
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 600);
}



/* ─── Google Sign-In ────────────────── */
function initGoogleLogin() {
  const btn = document.getElementById('btn-google');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.classList.add('loading');
    document.getElementById('login-error')?.classList.remove('show');

    try {
      const result = await auth.signInWithPopup(googleProvider);
      onLoginSuccess(result.user);
    } catch (err) {
      btn.classList.remove('loading');
      console.error('Detailed Google Sign-In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showError(`Sign-in failed: ${err.message || 'Please try again.'}`);
      }
    }
  });
}





/* ─── Logout ────────────────────────── */
function logout() {
  auth.signOut().then(() => {
    sessionStorage.removeItem(AUTH_KEY);
    gsap.to('body', {
      opacity: 0,
      duration: 0.35,
      onComplete: () => window.location.replace('index.html')
    });
  });
}

/* ─── Main init (index.html) ─────────── */
function initLogin() {
  // If already logged in via Firebase, skip login
  auth.onAuthStateChanged(user => {
    if (user) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem('sn_user_photo', user.photoURL || '');
      sessionStorage.setItem('sn_user_name', user.displayName || user.email || 'User');
      window.location.replace('portfolio.html');
    }
  });

  initGoogleLogin();
}

/* ─── Expose globals ────────────────── */
window.logout = logout;
window.authGuard = authGuard;
window.initLogin = initLogin;
