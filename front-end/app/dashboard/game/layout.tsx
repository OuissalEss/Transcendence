import React from "react";
//import Pong from "../pong/page";
// import "./Layout.css";
import './game.css';
import { CookiesProvider } from 'next-client-cookies/server';
// Importing all created components

// Pass the child props
export default function Layout({ children }) {
    return (
        <section className="flex justify-between full-game-page">
                <div className="game">
                    {children}
                </div>
        </section>
     );
}