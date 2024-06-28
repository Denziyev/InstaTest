import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase';

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().isAdmin) {
            setLoading(false);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error("Failed to verify admin status:", error);
          navigate('/');
        }
      } else {
        navigate('/auth');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="spinner">Loading...</div>; // Add a spinner or any loading indicator
  }

  return children;
};

export default AdminRoute;
