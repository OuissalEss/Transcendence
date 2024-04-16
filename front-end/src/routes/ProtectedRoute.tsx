import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider.tsx";
import { jwtDecode } from "jwt-decode";
import TwoFactorAuth from "../pages/TwoFactorAuth.tsx";
import Start from "../Start.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Friends from "../components/Friends.tsx";
import { useSocket } from "../App.tsx";


import '../App.css'

export interface Payload {
	sub: number;
	username: string;
	createdAt: string;
	isFirstTime: boolean
	isTwoFactorEnable: boolean
	isTwoFaAuthenticated: boolean
}

export const ProtectedRoute = () => {
	const { socket } = useSocket();
	const { token }: { token: string | undefined } = useAuth();

	// useEffect(() => {
	// 	if (token == null) {
	// 		navigate('/');
	// 	}
	// }, [token]);


	// Check if the user is authenticated
	if (!token) {
		// If not authenticated, redirect to the login page
		return <Navigate to="/" />;
	}
	else {
		socket?.emit("friendDisconnected");
	}

	const decodedToken: Payload = jwtDecode(token);


	if (decodedToken.isTwoFactorEnable && !decodedToken.isTwoFaAuthenticated) {
		return <TwoFactorAuth />
	}

	if (decodedToken.isFirstTime) {
		return <Start />
	}
	// If the validation is in progress, you may want to render a loading spinner or message
	return (
		<section className="flex justify-between dashboard">
			<div className="grid">
				<div className="col-span-1 Sidebar-container left-side">
					<Sidebar />
				</div>
				<div className="col-span-10">
					<Outlet />
				</div>
				<div className="col-span-1 Sidebar-container right-side">
					<Friends />
				</div>
			</div>
		</section>
	);
};
