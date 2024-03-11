// UserCard.tsx
import React from 'react';
import './signUp.css';

interface UserCardProps {
    avatar: string;
	userName: string;
}

const UserCard: React.FC<UserCardProps> = ({ avatar, userName }) => {
    return (
        <div className="user-card p-4 bg-gray-100 rounded-lg shadow-md absolute right-40 ">
            <div className="flex items-center">
                <div className="relative inline-block">
                    <img className="w-16 h-16 rounded-full border-2 border-white" src={avatar} alt="Avatar" />
                    <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-white absolute bottom-0 right-0"></span>
                </div>
                <div className="user-info">
                    <h2 className="text-lg font-semibold">{userName}</h2>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
