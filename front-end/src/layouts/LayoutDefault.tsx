import React from "react";

// Importing all created components
import Sidebar from "../components/Sidebar";
import Friends from "../components/Friends";

import '../App.css'
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