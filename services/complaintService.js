import { db, auth } from '../config/firebaseconfig'; 
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore'; 
 
export const submitComplaint = async (complaintData) => { 
  try { 
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const finalComplaintData = {
      ...complaintData,
      UserId: auth.currentUser.uid,
      CreatedAt: serverTimestamp(),
      Status: 'pending',
      UserEmail: auth.currentUser.email
    };

    console.log('Submitting complaint with data:', finalComplaintData);
    const docRef = await addDoc(collection(db, 'Complant foram'), finalComplaintData); 
    console.log('Complaint submitted with ID:', docRef.id); // Debug log 
    return docRef; 
  } catch (error) { 
    console.error('Error submitting complaint:', error); 
    throw error; 
  } 
}; 
 
export const getUserComplaints = async (userId) => { 
  try { 
    console.log('Fetching complaints for user:', userId);
    const complaintsRef = collection(db, 'Complant foram'); 
    const q = query( 
      complaintsRef, 
      where('UserId', '==', userId), 
      orderBy('CreatedAt', 'desc') 
    ); 
    
    const querySnapshot = await getDocs(q); 
    console.log('Found complaints:', querySnapshot.size);
    
    const complaints = []; 
    querySnapshot.forEach((doc) => { 
      const data = doc.data();
      console.log('Complaint data:', { id: doc.id, ...data });
      complaints.push({ 
        id: doc.id, 
        ...data 
      }); 
    }); 
     
    return complaints; 
  } catch (error) { 
    console.error('Error fetching complaints:', error); 
    throw error; 
  } 
};