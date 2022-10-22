/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  collection,
  getDocs,
  limit,
  query,
  where,
  Firestore
} from '@firebase/firestore';

import { log } from './logging';
import { createEmptyCollection, createDocuments } from './util';

export async function runTheTest(db: Firestore) {
  const collectionRef = createEmptyCollection(db, 'QueryLocalVarTest-');
  await createDocuments(collectionRef, {
    doc1: { username: 'testuser' },
    doc2: { username: 'testuser' }
  });
  await useLocalVariableForQuery(db, collectionRef.path);
  await noUseLocalVariableForQuery(db, collectionRef.path);
}

async function useLocalVariableForQuery(db: Firestore, collectionPath: string) {
  log('useLocalVariableForQuery() start');
  const query_ = query(
    collection(db, collectionPath),
    where('username', '==', 'testuser'),
    limit(1)
  );
  const userDoc = (await getDocs(query_)).docs[0];
  log(
    `Got document: ${userDoc.id} with contents: ${JSON.stringify(
      userDoc.data()
    )}`
  );
}

async function noUseLocalVariableForQuery(
  db: Firestore,
  collectionPath: string
) {
  log('noUseLocalVariableForQuery() start');
  const userDoc = (
    await getDocs(
      query(
        collection(db, collectionPath),
        where('username', '==', 'testuser'),
        limit(1)
      )
    )
  ).docs[0];
  log(
    `Got document: ${userDoc.id} with contents: ${JSON.stringify(
      userDoc.data()
    )}`
  );
}
