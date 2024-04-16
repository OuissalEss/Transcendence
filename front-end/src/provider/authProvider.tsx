import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
interface newTokenType {
    token: string | undefined
}

const data: newTokenType = {
    token: undefined
}

const AuthContext = createContext(data);

const AuthProvider = ({ children }: { children: any }) => {
    // State to hold the authentication token
    const [token, setToken] = useState<string | undefined>(Cookies.get("token"));

    useEffect(() => {
        setToken(Cookies.get("token"));
        const validateToken = async () => {
            try {
                if (token) {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
                    await fetch('http://localhost:3000/validate', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    }).then((res) => {
                        if (!res.ok) {
                            setToken('');
                            Cookies.remove('token');
                            throw Error("Error");
                        }
                    });
                } else {
                    delete axios.defaults.headers.common["Authorization"];
                }
            } catch (error) {
                setToken('');
                Cookies.remove('token');
                console.error("Token validation error:");
            }
        };

        validateToken();
    }, []);

    // Memoized value of the authentication context
    const contextValue = useMemo(() => ({ token }), [token]);

    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;