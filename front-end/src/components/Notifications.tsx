import { useState, useRef, useEffect } from 'react';
import User from '../types/user-interface';
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import {useSocket} from "../App.tsx";
import Leaderboard1 from "*.png";



const Notifications = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState<{id: string, type: string, isRead: boolean, notif: string}[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [notifs, setNotifs] = useState<User[] | null>(null);


    const { users } = useSocket();

    useEffect(() => {
        setNotifs(users);
    }, [users]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const updateNotifications = () => {

        let notifications1: {
            id: string;
            type: string;
            isRead: boolean;
            notif: string;
        }[] = [];

        notifications1 = notifs.map(n => ({
            id: n.id,
            type: "",
            isRead: false,
            notif: `'${n.username}' sent you friend request`
        }));
        notifications1[1].isRead = true;
        setNotifications(notifications1);
    }
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        // Dummy data for notifications
        updateNotifications();
    };

    return (
        <div className='notifs'>
            <div className="bellDiv" onClick={toggleDropdown}>
                <img
                    className="bellImg"
                    src="/Icons/Bell.png"
                    alt="search"
                />
            </div>
            {showDropdown && (
                <div className="notificationDropdown" ref={dropdownRef}>
                    {/* Display notifications */}
                    <ul className="notificationList">
                        {notifications.map((notification, index) => (
                            notification ?(
                                notification.isRead ? (
                                    <Link key={index} to={`/profiles?id=${notification.id}`}>
                                        <li className="notif" key={index}>222{notification.notif}</li>
                                    </Link>
                                ) : (
                                    <Link key={index} to={`/profiles?id=${notification.id}`}>
                                        <li className="notif" key={index}>1111{notification.notif}</li>
                                    </Link>
                                )
                            ) : null
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Notifications;
