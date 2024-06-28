import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase/firebase';
import {
  Box,
  Button,
  List,
  ListItem,
  Text,
  Flex,
  Heading,
  Avatar,
  Stack,
  Card,
  CardBody,
  CardFooter,
  HStack,
  useToast,
  Divider,
  Input,
  IconButton,
  Spacer,
  Badge,
  VStack,
  Container,
  Spinner,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ChakraProvider,
  extendTheme,
  useColorMode,
} from '@chakra-ui/react';
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

// Create a theme
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [sortOrder, setSortOrder] = useState('email');
  const [isAscending, setIsAscending] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const toast = useToast();
  const pageSize = 5; // Number of users per page

  const fetchTotalUsersCount = async () => {
    const usersCollection = await getDocs(collection(firestore, 'users'));
    const totalUsers = usersCollection.size;
    setTotalPages(Math.ceil(totalUsers / pageSize));
  };

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    const user = auth.currentUser;
    setCurrentUser(user);

    let usersQuery = query(
      collection(firestore, 'users'),
      orderBy(sortOrder, isAscending ? 'asc' : 'desc'),
      limit(pageSize)
    );
    if (page > 1 && lastVisible) {
      usersQuery = query(
        collection(firestore, 'users'),
        orderBy(sortOrder, isAscending ? 'asc' : 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    }

    const usersCollection = await getDocs(usersQuery);
    const usersList = usersCollection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUsers(usersList);
    setLastVisible(usersCollection.docs[usersCollection.docs.length - 1]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTotalUsersCount();
    fetchUsers();
  }, [auth, sortOrder, isAscending]);

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    setPageNumber(newPage);
    const user = auth.currentUser;
    setCurrentUser(user);

    let usersQuery = query(
      collection(firestore, 'users'),
      orderBy(sortOrder, isAscending ? 'asc' : 'desc'),
      limit(pageSize)
    );
    if (newPage > 1) {
      let lastVisibleDoc = null;
      for (let i = 1; i < newPage; i++) {
        const usersSnapshot = await getDocs(usersQuery);
        lastVisibleDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
        usersQuery = query(
          collection(firestore, 'users'),
          orderBy(sortOrder, isAscending ? 'asc' : 'desc'),
          startAfter(lastVisibleDoc),
          limit(pageSize)
        );
      }
      const usersSnapshot = await getDocs(usersQuery);
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLastVisible(lastVisibleDoc);
    } else {
      const usersSnapshot = await getDocs(usersQuery);
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLastVisible(usersSnapshot.docs[usersSnapshot.docs.length - 1]);
    }
  };

  const toggleAdmin = async (userId, isAdmin) => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      isAdmin: !isAdmin,
    });
    setUsers(users.map((user) => (user.id === userId ? { ...user, isAdmin: !isAdmin } : user)));
    toast({
      title: isAdmin ? 'Admin status revoked' : 'User promoted to admin',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleBlock = async (userId, isBlocked) => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      isBlocked: !isBlocked,
    });
    setUsers(users.map((user) => (user.id === userId ? { ...user, isBlocked: !isBlocked } : user)));
    toast({
      title: isBlocked ? 'User unblocked' : 'User blocked',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term === '') {
      setSearchResults([]);
      return;
    }

    const searchQuery = query(
      collection(firestore, 'users'),
      orderBy('email'),
      where('email', '>=', term),
      where('email', '<=', term + '\uf8ff')
    );

    const searchSnapshot = await getDocs(searchQuery);
    const searchList = searchSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSearchResults(searchList);
  };

  const handleShowBlocked = () => {
    setShowBlocked(!showBlocked);
    setShowAdmins(false);
  };

  const handleShowAdmins = () => {
    setShowAdmins(!showAdmins);
    setShowBlocked(false);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleToggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (pageNumber <= 4) {
        pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (pageNumber >= totalPages - 3) {
        pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', pageNumber - 1, pageNumber, pageNumber + 1, '...', totalPages);
      }
    }

    return (
      <HStack spacing={2}>
        <Button onClick={() => handlePageChange(pageNumber - 1)} isDisabled={pageNumber === 1}>
          Previous
        </Button>
        {pageNumbers.map((page, index) =>
          typeof page === 'number' ? (
            <Button
              key={index}
              colorScheme={pageNumber === page ? 'blue' : 'gray'}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ) : (
            <Text key={index}>...</Text>
          )
        )}
        <Button onClick={() => handlePageChange(pageNumber + 1)} isDisabled={pageNumber === totalPages}>
          Next
        </Button>
      </HStack>
    );
  };

  const displayedUsers = searchTerm
    ? searchResults
    : showBlocked
    ? users.filter((user) => user.isBlocked)
    : showAdmins
    ? users.filter((user) => user.isAdmin)
    : users;

  return (
    <Container maxW="7xl" p={5}>
      <Flex mb={6} justifyContent="space-between" alignItems="center">
        <Heading as="h1" size="xl" bgGradient="linear(to-r, teal.500, green.500)" bgClip="text">
          Admin Panel
        </Heading>
        <ThemeToggle />
        <Button colorScheme="blue" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
      {currentUser && (
        <Box mb={6}>
          <Card variant="outline">
            <CardBody>
              <Stack direction="row" align="center">
                <Avatar name={currentUser.email} />
                <Box ml={3}>
                  <Text fontWeight="bold" fontSize="lg">
                    {currentUser.email}
                  </Text>
                  <Badge colorScheme="green">Admin</Badge>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Divider my={6} />
        </Box>
      )}
      <Box mb={6}>
        <Flex>
          <Input
            placeholder="Search users by email"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            mr={2}
          />
          <IconButton aria-label="Search database" icon={<SearchIcon />} onClick={() => handleSearch(searchTerm)} />
        </Flex>
        <Flex mt={4}>
          <Button colorScheme={showBlocked ? 'red' : 'gray'} onClick={handleShowBlocked} mr={2}>
            {showBlocked ? 'Show All Users' : 'Show Blocked Users'}
          </Button>
          <Button colorScheme={showAdmins ? 'green' : 'gray'} onClick={handleShowAdmins}>
            {showAdmins ? 'Show All Users' : 'Show Admins'}
          </Button>
        </Flex>
        <Flex mt={4} alignItems="center">
          <Text mr={2}>Sort by:</Text>
          <Select value={sortOrder} onChange={handleSortChange} mr={2}>
            <option value="email">Email</option>
            <option value="createdAt">Creation Date</option>
            <option value="lastLogin">Last Login</option>
          </Select>
          <Button onClick={handleToggleSortOrder}>
            {isAscending ? 'Ascending' : 'Descending'}
          </Button>
        </Flex>
      </Box>
      <List spacing={4}>
        {isLoading ? (
          <Spinner size="xl" />
        ) : (
          displayedUsers
            .filter((user) => user.email !== currentUser?.email) // Exclude the current user
            .map((user) => (
              <ListItem key={user.id}>
                <Card variant="outline">
                  <CardBody>
                    <Stack direction="row" align="center">
                      <Avatar name={user.email} />
                      <Box ml={3}>
                        <Text fontWeight="bold">{user.email}</Text>
                        <Text>{user.isAdmin ? 'Admin' : 'User'}</Text>
                        <Text color={user.isBlocked ? 'red.500' : 'green.500'}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </Text>
                        <Text>Created At: {new Date(user.createdAt).toLocaleDateString()}</Text>
                        <Text>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</Text>
                      </Box>
                      <Spacer />
                      <HStack>
                        <ToggleAdminButton user={user} toggleAdmin={toggleAdmin} />
                        <ToggleBlockButton user={user} toggleBlock={toggleBlock} />
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>
              </ListItem>
            ))
        )}
      </List>
      <Flex justifyContent="center" mt={6}>
        {renderPagination()}
      </Flex>
    </Container>
  );
};

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const savedColorMode = localStorage.getItem('chakra-ui-color-mode');
    if (savedColorMode && savedColorMode !== colorMode) {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  return (
    <Button onClick={() => {
      toggleColorMode();
      localStorage.setItem('chakra-ui-color-mode', colorMode === 'light' ? 'dark' : 'light');
    }} ml={2}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

const ToggleAdminButton = ({ user, toggleAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme={user.isAdmin ? 'red' : 'green'}>
        {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Admin Status Change</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to {user.isAdmin ? 'revoke admin status' : 'promote to admin'} for {user.email}?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { toggleAdmin(user.id, user.isAdmin); onClose(); }}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ToggleBlockButton = ({ user, toggleBlock }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme={user.isBlocked ? 'red' : 'yellow'}>
        {user.isBlocked ? 'Unblock' : 'Block'}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Block Status Change</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to {user.isBlocked ? 'unblock' : 'block'} {user.email}?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => { toggleBlock(user.id, user.isBlocked); onClose(); }}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AdminPanel />
    </ChakraProvider>
  );
};

export default App;
