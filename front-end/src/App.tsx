// app.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Routes from './routes';
import { io, Socket } from 'socket.io-client';

import './assets/home.css'
import { useAuth } from "./provider/authProvider.tsx";
import { gql, useQuery } from "@apollo/client";
import User from "./types/user-interface.tsx";
import Loading from "./components/Loading.tsx";

interface SocketContextType {
    socket: Socket | undefined;
    connected: boolean;
    users: User[] | null,
    userData: User | null,
    friends: User[] | null
}

const initialSocketContextValue: SocketContextType = {
    socket: undefined,
    connected: false,
    users: null,
    userData: null,
    friends: null
};

export const SocketContext = createContext<SocketContextType>(initialSocketContextValue);

export const useSocket = () => useContext(SocketContext)!;

const USER_DATA = gql`
    query { 
        getUserFriends {
            id
            username
            status
            avatar{filename}
            createdAt
        }
        getUserInfo {
            id
            email
            username
            xp
            character
            connection {
                provider
                is2faEnabled
            }
            avatar {
              filename
            }
            achievements{
                achievement
                createdAt
            }
            blocking {id}
            winner{id}
            host{id}
            guest{id}
            createdAt
        }
        getAllUsers {
            id
            username
            avatar {
                filename 
            }
            xp
            winner{id}
        }
    }
`;

function App() {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [connected, setConnected] = useState<boolean>(false);
    const [users, setUsers] = useState<User[] | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [friends, setFriends] = useState<User[] | null>(null);
    const { token } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false); // State to track whether data is fetched

    useEffect(() => {
        if (token !== undefined) {
            const newSocket = io('http://localhost:3000/');

            newSocket.on('connect', () => {
                console.log('Socket connected');
                setConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, []);

    const results = useQuery(USER_DATA);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const {data, loading, error} = results;

                if (error) {
                    throw new Error('Failed to fetch user data');
                }
                if (loading) {
                    setLoading(true);
                }
                if (data) {
                    setUserData(data.getUserInfo);
                    setFriends(data.getUserFriends);
                    setUsers(data.getAllUsers);
                    // Simulate data fetching delay
                    await new Promise(resolve => setTimeout(resolve, 800)); // 2000 milliseconds delay (2 seconds)
                    // Set data fetched status to true
                    setDataFetched(true);
                    // setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }

        fetchData(); // Call fetchData when component mounts
    }, [results]);

    // Show loading indicator for 2 seconds before showing routes
    useEffect(() => {
        if (dataFetched) {
            // Set isLoading to false after 2 seconds
            const timeoutId = setTimeout(() => setLoading(false), 800); // 2000 milliseconds (2 seconds)

            // Clear timeout to prevent memory leak
            return () => clearTimeout(timeoutId);
        }
    }, [dataFetched]);

    const contextValue = useMemo(() => ({ socket, connected, userData, friends, users }), [socket, connected, userData, friends, users]);

    return (
        <SocketContext.Provider value={contextValue}>
            {isLoading ? <Loading /> : <Routes />}
        </SocketContext.Provider>
    );
}

export default App;
