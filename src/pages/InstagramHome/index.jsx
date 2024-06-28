import { Container, Flex, Box } from "@chakra-ui/react";
import React from "react";
import UserPosts from "../../components/UserPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";

const InstagramHome = () => {
  return (
    <Container maxW={"container.lg"}>
      <Flex gap={20}>
        <Box flex={2} py={10}>
          <UserPosts />
        </Box>
        <Box
          flex={3}
          mr={20}
          display={{ base: "none", lg: "block" }}
          maxW={"300px"}
        >
          <SuggestedUsers />
        </Box>
      </Flex>
    </Container>
  );
};

export default InstagramHome;
