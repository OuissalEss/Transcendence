import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

interface datatype {
    token: string | undefined,
    isValid: boolean
}

const data: datatype = {
    token: '',
    isValid: false
}

const AuthContext = createContext(data);

const AuthProvider = ({ children }) => {
    // State to hold the authentication token
    const [token, setToken] = useState(Cookies.get("token"));
    const [isValid, setValid] = useState(false);

    useEffect(() => {
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
                        console.log(res);
                        if (!res.ok) {
                            setToken('');
                            Cookies.remove('token');
                            setValid(false);
                            throw Error("Error");
                        } else if (res.ok) {
                            setValid(true);
                        }
                    });
                } else {
                    delete axios.defaults.headers.common["Authorization"];
                }
            } catch (error) {
                setValid(false);
                setToken('');
                Cookies.remove('token');
                console.error("Token validation error:");
            }
        };

        validateToken();
    }, []);

    // Memoized value of the authentication context
    const contextValue = useMemo(() => ({
        token,
        isValid
    }), [token, isValid]);

    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;