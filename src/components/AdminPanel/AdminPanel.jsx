import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase/firebase';
import { Box, Button, List, ListItem, Text } from '@chakra-ui/react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      setCurrentUser(user);

      const usersCollection = await getDocs(collection(firestore, 'users'));
      const usersList = usersCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, [auth]);

  const toggleAdmin = async (userId, isAdmin) => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      isAdmin: !isAdmin,
    });
    setUsers(users.map(user => user.id === userId ? {...user, isAdmin: !isAdmin} : user));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="2xl">Admin Panel</Text>
        <Button colorScheme="blue" onClick={handleLogout}>Logout</Button>
      </Box>
      <List spacing={3}>
        {users
          .filter(user => user.email !== currentUser?.email) // Exclude the current user
          .map((user) => (
            <ListItem key={user.id}>
              {user.email} - {user.isAdmin ? 'Admin' : 'User'}
              <Button
                ml={4}
                onClick={() => toggleAdmin(user.id, user.isAdmin)}
                colorScheme={user.isAdmin ? 'red' : 'green'}
              >
                {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
              </Button>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default AdminPanel;
