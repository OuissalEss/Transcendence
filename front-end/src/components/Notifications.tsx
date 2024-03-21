import React, { useState, useRef, useEffect } from 'react';
import User from '../types/user-interface';

import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { useQuery, gql, OperationVariables } from "@apollo/client";


const Notifications = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

        const [notifs, setNotifs] = useState<User[]>();
        const [isLoading, setLoading] = useState(true);

        const token: string | undefined = Cookies.get('token');
        const decodedToken = jwtDecode(token || '');
        const id = decodedToken.sub;

        const USER_DATA = gql`
            query { 
                getAllUsers {
                    id
                    username
                    status
                    avatar{filename}
                }
            }
        `;

        const resutls = useQuery(USER_DATA, {
            variables: { user_id: id }
        });

        useEffect(() => {
            try {

                const { data, loading, error } = resutls;

                if (loading) setLoading(true);
                if (error) {
                    throw new Error('Failed to fetch user data');
                }
                if (data) {
                    setNotifs(data.getAllUsers);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }

        }, [resutls]);


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


        if (isLoading) return <p>loadings</p>
        if (!notifs) return <p>pppp</p>

    const updateNotifications = () => {

        console.log("NOTIFS = :(");
        

        // let notifications1 = [
        //     { time: '', type: '', isRead: false, senderUserName: '' },
        // ];

        const notifications1 = notifs.map(notif => {
            // if()
            if (notif.status == 'ONLINE'){
                return `'${notif.username}' sent you friend request`;
            }
            else{
                return '';
            }
        });
        // console.log("NOTIFS = ", notifications1);
        // const not = getNotifications();
        // console.log("NOTIFS = ", notifications1);

        // let notifications1 = ['aa'];
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
                            notification != '' ?(
                                <li className="notif" key={index}>{notification}</li>
                            ) : null
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Notifications;
