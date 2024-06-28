import { Container, Flex, VStack } from "@chakra-ui/react";
import { Box, Image } from "@chakra-ui/react";
import React from "react";
import AuthPage from "../../components/AuthPage";

const Auth = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
      <Container maxW={"container.md"} padding={0}>
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
          <Box display={{ base: "none", md: "block" }}>
            <Image src="/İnstagramAuthPng.png" h={650} alt="AuthPhone Img" />
          </Box>
          <VStack spacing={4} align={"stretch"}>
            <AuthPage />
            <Box textAlign={"center"}>Get the app.</Box>
            <Flex gap={5} justifyContent={"center"}>
              <Image
                src="/Google.png"
                h={10}
                alt="Google Logo"
                cursor={"pointer"}
              />
              <Image
                src="/Microsoft.png"
                h={10}
                alt="Microsoft Logo"
                cursor={"pointer"}
              />
            </Flex>
          </VStack>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Auth;
