'use client';
import React from 'react';
import { useEffect } from 'react'

import { NextReactP5Wrapper } from "@p5-wrapper/next";
// import "./style.css";
import { relative } from 'path';
import Image from "next/image";

const Players = ({ username, leftScore, rightScore })  => {
    return (
        <div className="players-container grid grid-cols-6">

            <div className="col-span-2 center left-character">
                <span title="Left Character">
                    <Image
                        src="/Characters/Lumina/GameL.png"
                        alt=""
                        layout="responsive"
                        width={500}
                        height={500}
                    />
                </span>
            </div>

            <div className="col-span-2 center score-container grid grid-cols-3">
                <div className="col-span-1 center left-player">
                    <span title="Player">
                        <Image
                            className="player-img"
                            src="/Avatars/01.jpeg"
                            alt=""
                            layout="responsive"
                            width={10}
                            height={10}
                        />
                    </span>
                    <span className="player-name">
                        {username.length > 7 ? `${username.slice(0, 7)}.` : username}
                    </span>
                </div>
                <div className="col-span-1 center score-rounds">
                    <div className="rounds">Round 1</div>
                    <div className="score">
                        <span title="Left player score">{leftScore}</span>
                        <span> - </span>
                        <span title="Right player score">{rightScore}</span>
                    </div>
                </div>
                <div className="col-span-1 center right-player">
                    <span title="Player">
                        <Image
                            className="player-img"
                            src="/Avatars/02.jpeg"
                            alt=""
                            layout="responsive"
                            width={10}
                            height={10}
                        />
                    </span>
                    <span className="player-name">
                        Player2
                    </span>
                </div>
            </div>

            <div className="col-span-2 center right-character">
                <span title="Right Character">
                    <Image
                        src="/Characters/Nova/GameR.png"
                        alt=""
                        layout="responsive"
                        width={500}
                        height={500}
                    />
                </span>
            </div>

        </div>
        );
};


export default Players;
