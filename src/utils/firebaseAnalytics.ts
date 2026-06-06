import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app'
import { initializeAnalytics, isSupported, logEvent, setAnalyticsCollectionEnabled, type Analytics } from 'firebase/analytics'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAeli0g8Ty5n59rVx71ZnB8xZF6TGcBiEA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'url-shortner-80f07.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'url-shortner-80f07',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'url-shortner-80f07.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '731070014203',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:731070014203:web:5cc93dd8870fc48f35c65e',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-KWWRJ7G5HD',
}

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  firebaseConfig.measurementId
)

export const isFirebaseAnalyticsEnabled =
  import.meta.env.VITE_FIREBASE_ANALYTICS_ENABLED !== 'false' && hasFirebaseConfig

let analyticsPromise: Promise<Analytics | null> | null = null

const getFirebaseAnalytics = () => {
  if (!isFirebaseAnalyticsEnabled || typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  analyticsPromise ??= isSupported()
    .then((supported) => {
      if (!supported) return null

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
      const analytics = initializeAnalytics(app, {
        config: {
          send_page_view: false,
        },
      })
      setAnalyticsCollectionEnabled(analytics, true)
      return analytics
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.warn('Firebase Analytics unavailable:', error)
      }
      return null
    })

  return analyticsPromise
}

export const trackPageView = async (path: string) => {
  const analytics = await getFirebaseAnalytics()
  if (!analytics) return

  logEvent(analytics, 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
