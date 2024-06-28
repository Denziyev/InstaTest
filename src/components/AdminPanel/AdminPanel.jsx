import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { Box, Button, List, ListItem, Text } from '@chakra-ui/react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(firestore, 'users'));
      const usersList = usersCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const toggleAdmin = async (userId, isAdmin) => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      isAdmin: !isAdmin,
    });
    setUsers(users.map(user => user.id === userId ? {...user, isAdmin: !isAdmin} : user));
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Admin Panel</Text>
      <List spacing={3}>
        {users.map((user) => (
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
