// import { Flex, Image, Text } from "@chakra-ui/react";
// import React from "react";
// import { useSignInWithGoogle } from "react-firebase-hooks/auth";
// import { auth, firestore } from "../../firebase/firebase";
// import useShowToast from "../../hooks/useShowToast";
// import useAuthStore from "../../store/authStore";
// import { doc, setDoc } from "firebase/firestore";

// const GoogleAuth = ({ prefix }) => {
//   const [signInWithGoogle, error] = useSignInWithGoogle(auth);
//   const showToast = useShowToast();
//   const loginUser = useAuthStore((state) => state.login);

//   const handleGoogleAuth = async () => {
//     try {
//       const { user: newUser } = await signInWithGoogle();
//       if (!newUser && error) {
//         showToast("Error", error.message, "error");
//         return;
//       }
//       if (newUser) {
//         const userDoc = {
//           uid: newUser.uid,
//           email: newUser.user.email,
//           username: newUser.user.email.split("@")[0],
//           fullName: newUser.user.displayName,
//           bio: "",
//           profilePicURL: newUser.user.photoURL,
//           followers: [],
//           following: [],
//           posts: [],
//           createdAt: Date.now(),
//         };

//         await setDoc(doc(firestore, "users", newUser.uid), userDoc);

//         localStorage.setItem("user-info", JSON.stringify(userDoc));

//         loginUser(userDoc);
//       }
//     } catch (error) {
//       showToast("Error", error.message, "error");
//     }
//   };
//   return (
//     <Flex
//       alignItems={"center"}
//       justifyContent={"center"}
//       cursor={"pointer"}
//       onClick={handleGoogleAuth}
//     >
//       <Image src="/GoogleLogo.png" w={5} alt="Google Logo" />
//       <Text mx={2} color={"blue.500"} cursor={"pointer"}>
//         {prefix} with Google
//       </Text>
//     </Flex>
//   );
// };

// export default GoogleAuth;

import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { doc, getDoc, setDoc } from "firebase/firestore";

const GoogleAuth = ({ prefix }) => {
  const [signInWithGoogle, error] = useSignInWithGoogle(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore((state) => state.login);
  const handleGoogleAuth = async () => {
    try {
      const { user: newUser, error: authError } = await signInWithGoogle();

      if (authError) {
        showToast("Error", authError.message, "error");
        return;
      }

      if (!newUser) {
        showToast("Error", "User authentication failed", "error");
        return;
      }

      const userDoc = {
        uid: newUser.uid,
        email: newUser.email,
        username: newUser.email.split("@")[0],
        fullName: newUser.displayName,
        bio: "",
        profilePicURL: newUser.photoURL,
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now(),
      };

      await setDoc(doc(firestore, "users", newUser.uid), userDoc);

      localStorage.setItem("user-info", JSON.stringify(userDoc));

      loginUser(userDoc);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      onClick={handleGoogleAuth}
    >
      <Image src="/GoogleLogo.png" w={5} alt="Google Logo" />
      <Text mx={2} color="blue.500" cursor="pointer">
        {prefix} with Google
      </Text>
    </Flex>
  );
};

export default GoogleAuth;
