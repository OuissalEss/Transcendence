import React from "react";
//import Pong from "../pong/page";
// import "./Layout.css";
import './game.css';
import { CookiesProvider } from 'next-client-cookies/server';
// Importing all created components
import Sidebar from "../components/Sidebar/Sidebar";
import Player from "../components/Player/Player";
import Friends from "../components/Friends/Friends";

// Pass the child props
export default function Layout({ children }) {
    return (
        <main className="flex justify-between full-game-page">
            <div className="p-2 grid grid-cols-12 gap-16">
                <div className="col-span-1 center Sidebar-container left-side">
                    <Sidebar />
                </div>
                <div className="col-span-10 center game">
                    {children}
                </div>
                <div className="col-span-1 center Sidebar-container right-side">
                    <Friends />
                </div>
            </div>
        </main>
     );
}