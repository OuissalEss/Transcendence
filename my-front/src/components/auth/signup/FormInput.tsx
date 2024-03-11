// FormInput.tsx
import React, { ChangeEvent, FormEvent } from 'react';
import './signUp.css';
import useSignUp from './handleSignup';

interface FormInputProps {
    username: string;
    password: string;
    avatar: string;
    handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
    username,
    password,
    avatar,
    handleUsernameChange,
    handlePasswordChange,
}) => {
    const signUp = useSignUp();
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
          await signUp(username, password, avatar);
          console.log('User signed up successfully');
          // Do something after successful sign-up
        } catch (error) {
          console.error('Error signing up:', error);
          // Handle sign-up error
        }
      };
    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    className="w-48 h-8 p-2 rounded-md border-2 border-pink-300 mb-2"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <input
                    type="password"
                    className="w-48 h-8 p-2 rounded-md border-2 border-pink-300 mb-2"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                >Sign Up</button>
            </form>
        </div>
    );
};

export default FormInput;
