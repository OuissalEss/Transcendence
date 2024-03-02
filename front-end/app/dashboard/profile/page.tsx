'use client';
import Link from "next/link";
import jwt from 'jsonwebtoken';
import { useEffect, useState } from "react";
import User from "../../types/user-interace";
import { getCookie } from "cookies-next";

export default function About() {
    const [userData, setUserData] = useState<User>();
    const [isLoading, setLoading] = useState(true);
  
    useEffect(() => {
      const token = getCookie('token');
      const decodedToken = jwt.decode(token ? token : "");
  
      fetch('http://localhost:3000/graphql', {
          method: 'POST',
          body: JSON.stringify({
              query: `{ getUserById(id: "${decodedToken ? decodedToken.sub : ""}") {
                        id
                        email
                        username
                        connection {
                          provider
                          is2faEnabled
                        }
          }}`,
          }),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          next: { revalidate: 10 },
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch toilet data in a city');
        }
        return res.json()
      }).then((data) => {
        setUserData(data.data['getUserById']);
        setLoading(false);
      });
    }, []);
   
    if (isLoading) return <p>Loading...</p>
    if (!userData) return <p>No profile data</p>

    return (
        <main className="flex flex-col items-center justify-between p-24 ">
            <div>
                <h1><Link className="text-6xl" href="/">Profile</Link></h1>
                <div className="mt-9">
                    <p>ID: {userData.id}</p>
                    <p>Email: {userData.email}</p>
                    <p>Username: {userData.username}</p>
                    <p>Provider: {userData.connection.provider}</p>
                    <p>2FA: {userData.connection.is2faEnabled ? 'true' : 'false'}</p>
                </div>
            </div>
        </main>
    )
}

