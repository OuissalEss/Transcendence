// FormInput.tsx
import React, { ChangeEvent, FormEvent, useState } from 'react';
import './signUp.css';
import useSignUp from './handleSignup';
import { Link } from 'react-router-dom';
import { FormInputProps } from '../../../interfaces/props';

const FormInput: React.FC<FormInputProps> = ({
    username,
    avatar,
    email,
    isFormValid,
    handleUsernameChange,
    handleEmailChange,
}) => {

    const signUp = useSignUp();

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await signUp(username, avatar, email);
            console.log('User signed up successfully');
            // redirect to chat page
            
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
                    type="email"
                    className="w-48 h-8 p-2 rounded-md border-2 border-pink-300 mb-2"
                    placeholder="email"
                    value={email}
                    onChange={handleEmailChange}
                />
                {isFormValid && (
                    // <Link to="/login">
                        <button
                            type="submit"
                            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        >
                            Sign Up
                        </button>
                    // </Link>
                )}
            </form>
        </div>
    );
    // is signed up successfully redirect user to chat page
    // if (signedUp) {
    //     return <Redirect to="/chat" />;
    // }
};

export default FormInput;
