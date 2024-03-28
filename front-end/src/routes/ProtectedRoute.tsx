import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect } from "react";
import DashboardLayout from "../layouts/LayoutDefault.tsx";
import { jwtDecode } from "jwt-decode";
import TwoFactorAuth from "../pages/TwoFactorAuth.tsx";
import Start from "../Start.tsx";
import React from "react";


export interface Payload {
	sub: int;
	username: string;
	createdAt: date;
	isFirstTime: boolean
	isTwoFactorEnable: boolean
	isTwoFaAuthenticated: boolean
}

export const ProtectedRoute = () => {
	const { token }: { token: string | undefined } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (token == null) {
			navigate('/');
		}
	}, [token]);


	// Check if the user is authenticated
	if (!token) {
		// If not authenticated, redirect to the login page
		return <Navigate to="/" />;
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
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	);
};
