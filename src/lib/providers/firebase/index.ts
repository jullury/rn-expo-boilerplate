export {
  getFirebaseApp,
  getFirebaseAuth,
  getFirestoreDb,
} from "@/lib/providers/firebase/client";
export { firebaseAuthProvider } from "@/lib/providers/firebase/auth";
export {
  firebaseGetById,
  firebaseListWhere,
  firebaseCreate,
  firebaseUpdate,
  firebaseUpsert,
  firebaseDelete,
} from "@/lib/providers/firebase/api";
export type { FirebaseApiResult } from "@/lib/providers/firebase/api";
