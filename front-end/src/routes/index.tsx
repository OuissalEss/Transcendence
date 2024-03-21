import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";

import Home from '../pages/Dashboard';
import Login from "../pages/Login";
import Start from '../Start';
import About from '../pages/About';
import Chat from "../pages/Chat";
import Game from "../pages/game/Game";
import Pong from "../pages/game/pong/Pong";
import GetStarted from '../pages/GetStarted';
import Settings from "../pages/Settings";
import Test from "../pages/test";


const Routes = () => {
    const { token } = useAuth();

    // Define public routes accessible to all users
    const routesForPublic = [
        {
            path: "/service",
            element: <div>Service Page</div>,
        },

    ];

    // Define routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
            children: [
                {
                    path: "/about",
                    element: <About />,
                },
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/profile",
                    element: <div>User Profile</div>,
                },
                {
                    path: '/chat',
                    element: <Chat />
                },
                {
                    path: '/game',
                    element: <Game />
                },
                {
                    path: '/game/pong',
                    element: <Pong />
                },
                {
                    path: "/start",
                    element: <Start />,
                },
                {
                    path: "/settings",
                    element: <Settings />,
                },
                {
					path: "/test",
					element: <Test />,
				},
            ],
        },
    ];

    // Define routes accessible only to non-authenticated users
    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <GetStarted />,
        },
        {
            path: "/login",
            element: <Login />,
        },
    ];

    // Combine and conditionally include routes based on authentication status
    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    // Provide the router configuration using RouterProvider
    return <RouterProvider router={router} />;
};

export default Routes;