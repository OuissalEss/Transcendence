import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, res: NextResponse) {
    const cookieStore = cookies();


    if (request.nextUrl.pathname.startsWith('/login') && !cookieStore.has('token')) {
        return;
    }

    if (!cookieStore.has('token')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const token: RequestCookie = <RequestCookie>cookieStore.get('token');

    // Verify if the token is valide
    const validate = await fetch('http://localhost:3000/validate', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.value}`
        },
    }).then((res) => {
        if (!res.ok) {
            return false
        }
        return true
    });

    if (!validate) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard/profile', request.url));
    }

    try {
        const decodedToken = jwt.decode(token.value);
        //        // Check if the token is expired
        //        if (decodedToken.exp * 1000 < Date.now()) {
        //            // Token is expired, initiate the token refresh process
        //            refreshToken()
        //        .then(() => {
        //            // Token refreshed successfully, continue processing the request
        //        })
        //        .catch((error) => {
        //            console.error('Error refreshing token:', error);
        //            // Redirect to login page or handle the error as needed
        //            return NextResponse.redirect(new URL('/', request.url));
        //        });
        //        }
        //
        //        // If the token is still valid, store user data in the session
        //        if (decodedToken && decodedToken.user) {
        //            // Assuming decodedToken.user contains user data
        //            request.session.set('user', decodedToken.user);
        //        }

        // Continue processing the request
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        // Handle the error, e.g., redirect to login
        return NextResponse.redirect(new URL('/', request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|Characters|Avatars|Icons|favicon.ico|$).*)',
    ],
};