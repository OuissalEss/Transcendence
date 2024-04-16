import { useState, useRef, useEffect } from 'react';
import Notifs from '../types/notifications-interface.tsx';
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useSocket } from "../App.tsx";
import { useMutation } from '@apollo/react-hooks'
import { Socket, io } from 'socket.io-client';

const NOTIF_QUERY = gql`
    query {
        getUserNotifications {
            id
            time
            type
            isRead
            inviteCode
            receiver{
                id
            }
            sender{
                id
                username
                avatar {
                    filename
                }
            }
        }
    }`;

const UPDATE_READ = gql`
    mutation($id: String!) {
        updateIsRead(id: $id){
            id
        }
    }
`;

const Notifications = () => {
    const [updateNotifIsRead] = useMutation(UPDATE_READ);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState<{ id: string, userId: string, type: string, isRead: Boolean, notif: string, time: Date, inviteCode: string }[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { socket } = useSocket();
    const [sock, setSocket] = useState<Socket>();

    console.log(notifications);
    useEffect(() => {
        const newSocket = io('ws://localhost:3003/chat');
        setSocket(newSocket);


        return () => {
            newSocket.disconnect();
        };
    }, [setSocket]);

    useEffect(() => {
        if (socket == undefined) return;

        socket.on('RequestReceived', () => {
            setShowNotification(true);
        })

        socket.on('RequestGame', () => {
            setShowNotification(true);
        })

    }, [socket, sock]);

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
    const { data: notifData, loading: notifLoading, error: notifError, refetch: notifRefetch } = useQuery(NOTIF_QUERY);

    if (notifLoading) return <p>Loading...</p>;
    if (notifError) return <p>Error: {notifError?.message}</p>;

    if (notifData) notifData;
    const updateNotifications = (notifications: Notifs[]) => {
        let notificationList: { id: string; userId: string; type: string; isRead: Boolean; notif: string; time: Date; inviteCode: string }[] = [];
        for (let i = 0; i < notifications.length; i++) {
            if (!notifications[i].isRead) {
                let newNotification = {
                    id: notifications[i].id,
                    userId: notifications[i].sender.id,
                    type: notifications[i].type,
                    isRead: notifications[i].isRead,
                    time: notifications[i].time,
                    inviteCode: notifications[i].inviteCode,
                    notif: ''
                };
                if (notifications[i].type === 'FRIEND_REQUEST') {
                    newNotification.notif = `${notifications[i].sender.username} sent you a friend request`;
                } else if (notifications[i].type === 'ACHIEVEMENT') {
                    newNotification.notif = 'New achievement';
                } else if (notifications[i].type === 'MATCH') {
                    newNotification.notif = `${notifications[i].sender.username} invites you to a game`;
                }
                notificationList.push(newNotification);
            }
        }
        notificationList.forEach((a, indexA) => {
            notificationList.forEach((b, indexB) => {
                if (indexA !== indexB && a.userId === b.userId && a.type === b.type) {
                    if (a.time >= b.time) {
                        notificationList.splice(indexB, 1);
                    } else {
                        notificationList.splice(indexA, 1);
                    }
                }
            });
        });
        notificationList.sort((a, b) => {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
        if (showDropdown == false && notificationList.length > 0)
            setShowNotification(true);
        setNotifications(notificationList);
    }
    const HandleOnLoad = async () => {
        let notifications = await notifRefetch();
        notifications = await notifRefetch();
        updateNotifications(notifications.data?.getUserNotifications);
    };
    const toggleDropdown = async () => {
        setShowDropdown(!showDropdown);
        let notifications = await notifRefetch();
        notifications = await notifRefetch();
        updateNotifications(notifications.data?.getUserNotifications);
        setShowNotification(false);
    };

    const updateIsRead = async (notifId: string) => {
        try {
            await updateNotifIsRead({ variables: { id: notifId } });
        } catch (error: any) {
            console.error("Error updating Read:", error.message);
        }
    };

    return (
        <div className='notifs' onLoad={HandleOnLoad}>
            <div className="bellDiv" onClick={toggleDropdown}>
                <img
                    className="bellImg"
                    src="/Icons/Notifs.png"
                    alt="search"
                    referrerPolicy="no-referrer"
                />
                <div className={showNotification ? "cercleNotif visible" : "cercleNotif"}></div>
            </div>
            {showDropdown && (
                <div className="notificationDropdown" ref={dropdownRef}>
                    {/* Display notifications */}
                    {notifications.length > 0 ? (
                        <ul className="notificationList">
                            {notifications.map((notification, index) => (
                                notification && notification.type == "MATCH" ? (
                                    <Link key={index} to={`/game/pong?mode=invite&inviteCode=${notification?.inviteCode}`} onClick={() => updateIsRead(notification.id)}>
                                        <li className="notif" key={index}>🏓 {notification.notif}</li>
                                    </Link>
                                ) : (
                                    <Link key={index} to={`/profiles?id=${notification.userId}`} onClick={() => updateIsRead(notification.id)}>
                                        <li className="notif" key={index}>{notification.type === "FRIEND_REQUEST" ? "👫" : "🏆"} {notification.notif}</li>
                                    </Link>
                                )
                            ))}
                        </ul>
                    ) : (
                        <div className="noNotificationsContainer">
                            <p className="noNotificationsMessage">No notifications yet</p>
                            <img className="noNotificationsImage" src="/Icons/noNotifs.png" alt="No notifications" referrerPolicy="no-referrer" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Notifications;
