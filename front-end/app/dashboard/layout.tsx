import React from "react";
//import Pong from "../pong/page";
// import "./Layout.css";
import { CookiesProvider } from 'next-client-cookies/server';
// Importing all created components
import Sidebar from "../components/Sidebar/Sidebar";
import Player from "../components/Player/Player";
import Friends from "../components/Friends/Friends";

// Pass the child props
export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
        <section className="flex justify-between dashboard">
            <div className="grid">
                <div className="col-span-1 Sidebar-container left-side">
                    <Sidebar />
                </div>
                <div className="col-span-10">
                    {children}
                </div>
                <div className="col-span-1 Sidebar-container right-side">
                    <Friends />
                </div>
            </div>
        </section>
     );
}