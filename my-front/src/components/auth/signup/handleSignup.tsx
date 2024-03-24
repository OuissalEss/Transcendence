import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../../graphql/mutations";

const useSignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  

  const signUp = async (username: string, avatar: string, email: string) => {
    try {
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
