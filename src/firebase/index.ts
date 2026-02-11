'use client';

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
export * from './errors';
export * from './error-emitter';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useRef } from 'react';

export function initializeFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const auth = getAuth(app);
  const db = getFirestore(app);
  return { app, auth, db };
}

export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<T | null>(null);
  const depsRef = useRef<any[]>([]);

  const changed = deps.length !== depsRef.current.length || deps.some((dep, i) => dep !== depsRef.current[i]);

  if (changed || ref.current === null) {
    ref.current = factory();
    depsRef.current = deps;
  }

  return ref.current!;
}