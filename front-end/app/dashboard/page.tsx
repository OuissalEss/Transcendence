'use client';
import Link from "next/link";
import jwt from 'jsonwebtoken';
import { useEffect, useState } from "react";
import User from "../types/user-interace";
import { getCookie } from "cookies-next";
import GameLoading from "../components/Loading/GameLoading";


export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);

    // Simulate a longer loading time (e.g., 1 seconds)
    const delay = 300000;
    const timer = setTimeout(() => { setLoading(false)}, delay);
   
    if (isLoading) {
      return <GameLoading />;
    }

    return (
        <main className="flex flex-col items-center justify-between p-24 ">
            <div>
              <h1>Dasboard</h1>
            </div>
        </main>
    )
}

