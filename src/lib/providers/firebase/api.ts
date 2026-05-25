import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/providers/firebase/client";

export type FirebaseApiResult<T = unknown> = {
  data: T | null;
  error: string | null;
};

export async function firebaseGetById<T = DocumentData>(
  collectionName: string,
  id: string,
): Promise<FirebaseApiResult<T>> {
  try {
    const db = getFirestoreDb();
    const snap = await getDoc(doc(db, collectionName, id));
    if (!snap.exists()) {
      return { data: null, error: null };
    }
    return { data: { id: snap.id, ...snap.data() } as T, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Read failed";
    return { data: null, error: message };
  }
}

export async function firebaseListWhere<T = DocumentData>(
  collectionName: string,
  field: string,
  op: "==" | "!=" | ">" | ">=" | "<" | "<=",
  value: unknown,
): Promise<FirebaseApiResult<T[]>> {
  try {
    const db = getFirestoreDb();
    const q = query(collection(db, collectionName), where(field, op, value));
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T[];
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed";
    return { data: null, error: message };
  }
}

export async function firebaseCreate<T extends DocumentData>(
  collectionName: string,
  payload: T,
): Promise<FirebaseApiResult<{ id: string } & T>> {
  try {
    const db = getFirestoreDb();
    const ref = await addDoc(collection(db, collectionName), payload);
    return { data: { id: ref.id, ...payload }, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Create failed";
    return { data: null, error: message };
  }
}

export async function firebaseUpdate(
  collectionName: string,
  id: string,
  payload: Partial<DocumentData>,
): Promise<FirebaseApiResult<boolean>> {
  try {
    const db = getFirestoreDb();
    await updateDoc(doc(db, collectionName, id), payload);
    return { data: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return { data: null, error: message };
  }
}

export async function firebaseUpsert<T extends DocumentData>(
  collectionName: string,
  id: string,
  payload: T,
): Promise<FirebaseApiResult<{ id: string } & T>> {
  try {
    const db = getFirestoreDb();
    await setDoc(doc(db, collectionName, id), payload, { merge: true });
    return { data: { id, ...payload }, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upsert failed";
    return { data: null, error: message };
  }
}

export async function firebaseDelete(
  collectionName: string,
  id: string,
): Promise<FirebaseApiResult<boolean>> {
  try {
    const db = getFirestoreDb();
    await deleteDoc(doc(db, collectionName, id));
    return { data: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return { data: null, error: message };
  }
}
