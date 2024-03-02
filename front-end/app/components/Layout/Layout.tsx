import React from "react";
import Pong from "../pong/page";
// import "./Layout.css";

// Importing all created components
import Sidebar from "../Sidebar/Sidebar";

// Pass the child props
export default function Layout({ children }) {
  return (
    <main className="flex h-screen flex-col justify-between p-3 grid grid-cols-12 gap-4">
      <div className="col-span-1 center Sidebar-container">
        <Sidebar />
      </div>
      <div className="col-span-10 center game">
        <Players />
        {children}
      </div>
      <div className="col-span-1 center Sidebar-container"></div>
    </main>
    );
}