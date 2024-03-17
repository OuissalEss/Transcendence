import { gql, useMutation, useQuery } from "@apollo/client";

// Define the GraphQL mutation
const CREATE_USER = gql`
  mutation CreateUser($avatar: String!, $email: String!,  $usrnm: String!) {
    createUser(avatar: $avatar, email: $email, usrnm: $usrnm) {
      id
      username
      avatarTest
    }
  }
`;

// const CHECK_USER_EXISTENCE = gql`
//   query CheckUserExistence($email: String!, $username: String!) {
//     CheckUserExistence(email: $email, username: $username)
//   }
// `;

const useSignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  

  const signUp = async (username: string, avatar: string, email: string) => {
    try {
      // Function to check if a user exists with the provided username or email
      // const checkUserExistence = useQuery(CHECK_USER_EXISTENCE, {
      //   variables: { username, email },
      // });

      // Await the result of the query
      // await checkUserExistence.refetch();

      // If user with the username or email exists, throw an error
      // if (
      //   checkUserExistence.data &&
      //   (checkUserExistence.data.userExistsByUsername || checkUserExistence.data.userExistsByEmail)
      // ) {
      //   throw new Error("Username or email already exists");
      // }

      // Create the new user if the username and email are available
      const { data: createUserResponse } = await createUser({
        variables: {
          avatar,
          email,
          usrnm: username,
        },
      });

      // Log the successful creation of the user
      console.log('User created successfully:', createUserResponse);

      // Return the created user data if needed
      return { data: createUserResponse };
    } catch (error) {
      // Handle errors by logging and throwing them to be handled in the component
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Return the signUp function to be used by components
  return signUp;
};

export default useSignUp;
