import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
	const { token, isValid } = useAuth();

	console.log(token, isValid);
	// Check if the user is authenticated
	if (!token) {
		// If not authenticated, redirect to the login page
		return <Navigate to="/" />;
	}

	// If the validation is in progress, you may want to render a loading spinner or message
	return <Outlet />;
};