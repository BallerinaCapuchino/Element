import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { auth, db } from '../firebase';
import { User, Order, VisitorLog } from '../types';

// Преобразование данных из Firestore в наш тип User
const mapUserDoc = (docSnap: any): User => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    email: data.email,
    name: data.name,
    isAdmin: data.isAdmin || false,
    phone: data.phone
  };
};

export const mockApi = {
  // --- VISITOR LOGGING ---
  logVisitor: async () => {
    try {
        // Fetch IP from external service
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;

        await addDoc(collection(db, "visitors"), {
            ip: ip,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        console.error("Failed to log visitor", e);
    }
  },

  getRecentVisitors: async (): Promise<VisitorLog[]> => {
      try {
          const q = query(
              collection(db, "visitors"), 
              orderBy("timestamp", "desc"), 
              limit(50)
          );
          const snapshot = await getDocs(q);
          const visitors: VisitorLog[] = [];
          snapshot.forEach(doc => {
              const d = doc.data();
              visitors.push({
                  id: doc.id,
                  ip: d.ip,
                  userAgent: d.userAgent,
                  timestamp: d.timestamp
              });
          });
          return visitors;
      } catch (e) {
          console.error("Failed to get visitors", e);
          return [];
      }
  },

  // --- AUTH ---

  register: async (email: string, password: string, name: string): Promise<User> => {
    // 1. Создаем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // 2. Создаем документ пользователя в коллекции 'users'
    const newUser: User = {
      id: fbUser.uid,
      email: fbUser.email || email,
      name: name,
      isAdmin: false
    };

    await setDoc(doc(db, "users", fbUser.uid), newUser);
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    // 1. Логин в Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // 2. Получаем данные профиля из Firestore
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return mapUserDoc(userDoc);
    } else {
      // Если пользователя нет в базе (редкий кейс), возвращаем базовые данные
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: 'User',
      };
    }
  },

  socialLogin: async (providerName: 'telegram'): Promise<User> => {
    // Since we don't have a backend for real Telegram Auth, we mock it.
    // In a real app, this would involve a redirect or a widget callback.
    if (providerName === 'telegram') {
        const mockId = 'tg_' + Date.now();
        const newUser: User = {
            id: mockId,
            email: `tg_user_${mockId.slice(-4)}@telegram.mock`,
            name: 'Telegram User',
            isAdmin: false
        };
        // Just mocking the persistence
        // Note: This won't create a Firebase Auth session properly without a custom token.
        // For the sake of this UI demo, we will simulate a successful login return.
        return newUser;
    }
    throw new Error("Unknown provider");
  },

  logout: async () => {
    await signOut(auth);
  },

  // Получение профиля текущего пользователя (для AuthContext)
  getUserProfile: async (uid: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return mapUserDoc(userDoc);
    }
    return null;
  },

  // --- ORDERS ---

  createOrder: async (userId: string, data: any): Promise<Order> => {
    const orderData = {
      userId,
      date: new Date().toISOString(),
      status: 'pending',
      items: 'Индивидуальный заказ',
      details: data
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    return {
      id: docRef.id,
      ...orderData
    } as Order;
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    // Сортировка на клиенте, либо можно добавить .orderBy("date", "desc") в запрос (требует индекса)
    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // --- ADMIN ---

  getAllUsers: async (): Promise<User[]> => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push(mapUserDoc(doc));
    });
    return users;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const q = query(collection(db, "orders"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<void> => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
  }
};