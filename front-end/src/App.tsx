// app.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Routes from './routes/index.tsx';
import { io, Socket } from 'socket.io-client';

import './assets/home.css'
import { useAuth } from "./provider/authProvider.tsx";
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

const USER_DATA = `
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
            loser{id}
            host{id}
            guest{id}
            createdAt
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
    const [isLoading, setLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false); // State to track whether data is fetched

    useEffect(() => {
        if (token == undefined) return;

        const socketOptions = {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        Authorization: `Bearer ${token}`, // 'Bearer h93t4293t49jt34j9rferek...'
                    }
                }
            }
        };

        const newSocket = io('http://localhost:3000/', socketOptions);

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
    }, []);



    useEffect(() => {
        if (!token) return; // If token is not available, do nothing

        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                query: USER_DATA
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(async ({ data }) => {
                if (data) {
                    setUserData(data.getUserInfo);
                    setFriends(data.getUserFriends);
                    setUsers(data.getAllUsers);
                    localStorage.setItem('user', JSON.stringify({ id: data.getUserInfo.id, username: data.getUserInfo.username, icon: data.getUserInfo.filename || '/Avatars/default.jpeg', }));

                    // Simulate data fetching delay
                    await new Promise(resolve => setTimeout(resolve, 800)); // 2000 milliseconds delay (2 seconds)
                    // Set data fetched status to true
                    setDataFetched(true);
                    // setLoading(false);
                }
            }).catch(error => {
                setLoading(false);
                console.error('Error fetching friends:', error);
            });

        // Cleanup function
        return () => {
            // Perform any cleanup here if necessary
        };
    }, []);

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

    if (isLoading) return <Loading />

    return (
        <SocketContext.Provider value={contextValue}>
            <Routes />
        </SocketContext.Provider>
    );
}

export default App;
