import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error('Firebase service account file not found');
    }

    const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

  }

  async sendToFirestore(collection: string, docId: string, data: any) {
    const db = admin.firestore();
    return db.collection(collection).doc(docId).set(data);
  }
}
