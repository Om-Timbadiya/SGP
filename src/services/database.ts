import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection references
const USERS = 'users';
const ASSESSMENTS = 'assessments';
const RESULTS = 'results';
const CERTIFICATES = 'certificates';
const DISCUSSIONS = 'discussions';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: Timestamp;
  lastLogin: Timestamp;
  profile: {
    avatar?: string;
    phone?: string;
    organization?: string;
    skills: string[];
    certificates: string[];
    accessibility: string[];
  };
}

export interface DBAssessment {
  id: string;
  title: string;
  description: string;
  type: 'mcq' | 'practical' | 'descriptive' | 'viva';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdBy: string;
  createdAt: Timestamp;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'draft' | 'published' | 'archived';
  accessibility: string[];
  questions: {
    id: string;
    type: string;
    content: string;
    options?: string[];
    correctAnswer?: string;
    points: number;
  }[];
  settings: {
    shuffleQuestions: boolean;
    showResults: boolean;
    passingScore: number;
    allowReview: boolean;
    proctoring: boolean;
  };
}

export interface DBResult {
  id: string;
  userId: string;
  assessmentId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  score: number;
  submittedAt: Timestamp;
  answers: {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  feedback?: string;
  verified: boolean;
  blockchainHash?: string;
}

class DatabaseService {
  async createUser(userData: Partial<DBUser>): Promise<void> {
    if (!userData.id) throw new Error('User ID is required.');
    const userRef = doc(db, USERS, userData.id);
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
    });
  }

  async updateUser(userId: string, data: Partial<DBUser>): Promise<void> {
    if (!userId) throw new Error('User ID is required.');
    const userRef = doc(db, USERS, userId);
    await updateDoc(userRef, { ...data, lastLogin: Timestamp.now() });
  }

  async getUser(userId: string): Promise<DBUser | null> {
    if (!userId) throw new Error('User ID is required.');
    const userRef = doc(db, USERS, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? (userSnap.data() as DBUser) : null;
  }

  // 🚀 Assessment Operations
  async createAssessment(assessment: Partial<DBAssessment>): Promise<string> {
    const assessmentRef = doc(collection(db, ASSESSMENTS));
    const id = assessmentRef.id;
    await setDoc(assessmentRef, {
      ...assessment,
      id,
      createdAt: Timestamp.now(),
      status: 'draft',
    });
    return id;
  }

  async getAssessment(id: string): Promise<DBAssessment | null> {
    if (!id) throw new Error('Assessment ID is required.');
    const assessmentRef = doc(db, ASSESSMENTS, id);
    const assessmentSnap = await getDoc(assessmentRef);
    return assessmentSnap.exists() ? (assessmentSnap.data() as DBAssessment) : null;
  }

  async getUserAssessments(): Promise<DBAssessment[]> {
    const q = query(
      collection(db, ASSESSMENTS),
      where('status', '==', 'published'),
      orderBy('startDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as DBAssessment);
  }

  // 🚀 Results Operations
  async submitResult(result: Partial<DBResult>): Promise<void> {
    const resultRef = doc(collection(db, RESULTS));
    await setDoc(resultRef, {
      ...result,
      id: resultRef.id,
      submittedAt: Timestamp.now(),
      verified: false,
    });
  }

  async getResult(resultId: string): Promise<DBResult | null> {
    if (!resultId) throw new Error('Result ID is required.');
    const resultRef = doc(db, RESULTS, resultId);
    const resultSnap = await getDoc(resultRef);
    return resultSnap.exists() ? (resultSnap.data() as DBResult) : null;
  }

  async getUserResults(userId: string): Promise<DBResult[]> {
    if (!userId) throw new Error('User ID is required.');
    const q = query(
      collection(db, RESULTS),
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as DBResult);
  }

  // 🚀 Discussion Operations
  async createDiscussion(data: Partial<{ title: string; content: string; userId: string }>): Promise<string> {
    if (!data.title || !data.content || !data.userId) throw new Error('Missing discussion data.');
    const discussionRef = doc(collection(db, DISCUSSIONS));
    await setDoc(discussionRef, {
      ...data,
      id: discussionRef.id,
      createdAt: Timestamp.now(),
    });
    return discussionRef.id;
  }

  async getDiscussions(limitNum: number = 10): Promise<any[]> {
    const q = query(
      collection(db, DISCUSSIONS),
      orderBy('createdAt', 'desc'),
      limit(limitNum)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }

  // 🚀 Certificate Operations
  async createCertificate(data: Partial<{ userId: string; title: string }>): Promise<void> {
    if (!data.userId || !data.title) throw new Error('Certificate data is required.');
    const certificateRef = doc(collection(db, CERTIFICATES));
    await setDoc(certificateRef, {
      ...data,
      id: certificateRef.id,
      issuedAt: Timestamp.now(),
    });
  }

  async getUserCertificates(userId: string): Promise<any[]> {
    if (!userId) throw new Error('User ID is required.');
    const q = query(
      collection(db, CERTIFICATES),
      where('userId', '==', userId),
      orderBy('issuedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }
}

export const databaseService = new DatabaseService();
