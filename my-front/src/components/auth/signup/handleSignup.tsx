import { gql, useMutation } from "@apollo/client";

// Define the GraphQL mutation
const CREATE_USER = gql`
  mutation CreateUser($avatar: String!, $pwd: String!, $usrnm: String!) {
    createUser(avatar: $avatar, pwd: $pwd, usrnm: $usrnm) {
      id
      username
      avatar
      password
    }
  }
`;

const useSignUp = () => {
  const [createUser] = useMutation(CREATE_USER);

  const signUp = async (username: string, password: string, avatar: string) => {
    console.log('username: ', username);
    console.log('password: ', password);
    console.log('avatar: ', avatar);
    try {
      const { data } = await createUser({
        variables: {
          avatar: avatar,
          pwd: password,
          usrnm: username,
        },
      });

      // Log the successful creation of the user
      console.log('User created successfully:', data);

      // Return the created user data if needed
      return data;
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
