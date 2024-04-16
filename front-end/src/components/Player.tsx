'use client';

import { useEffect, useState } from "react";
import User from "../types/user-interface";
import { useAuth } from "../provider/authProvider";
import GameLoading from "./GameLoading";

interface GameData {
    p2Id: string,
    p2Username: string,
    p2Image: string,
    p2Character: string,
    p2Host: boolean,
}

interface player {
    id: any,
    username: any,
    image: any,
    character: any,
}

const USER_DATA_QUERY = `
    query UserData {
            getUserInfo {
                id
                username
                character
                avatar{filename}
            }
        }
    `;

const Players = ({ gameMode, gameData, leftScore, rightScore }: { gameMode: any, gameData: GameData | null, leftScore: number, rightScore: number }) => {
    const [userData, setUserData] = useState<User>();
    const [isLoading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!token) return;

                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ query: USER_DATA_QUERY })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const { data } = await response.json();

                if (data && data.getUserInfo) {
                    setUserData(data.getUserInfo);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    let leftPlayer: player = {
        id: userData?.id,
        username: userData?.username,
        image: userData?.avatar?.filename,
        character: userData?.character,
    };
    let rightPlayer: player = {
        id: gameData?.p2Id,
        username: gameData?.p2Username,
        image: gameData?.p2Image,
        character: gameData?.p2Character,
    };
    if (gameMode == 'ai') {
        rightPlayer = {
            id: '',
            username: 'Robot',
            image: '/Avatars/robot.jpeg',
            character: 'Pixie',
        };
    }
    else if (gameMode == 'offline') {
        rightPlayer = {
            id: '',
            username: 'Player',
            image: '/Avatars/default.jpeg',
            character: 'Aurora',
        };
    }
    if (gameData && gameData.p2Host == false) {
        // left
        leftPlayer.id = gameData.p2Id;
        leftPlayer.username = gameData.p2Username;
        leftPlayer.image = gameData.p2Image;
        leftPlayer.character = gameData.p2Character;
        // right
        rightPlayer.id = userData?.id;
        rightPlayer.username = userData?.username;
        rightPlayer.image = userData?.avatar?.filename;
        rightPlayer.character = userData?.character;
    }

    return (
        <div className="players-container grid grid-cols-9">
            {isLoading ? (
                <GameLoading />
            ) : (
                <>
                    <div className="col-span-1 center left-character">
                        <span title="Left Character">
                            <img
                                src={`/Characters/${leftPlayer.character}/GameL.png`}
                                alt=""
                                referrerPolicy="no-referrer"
                            />
                        </span>
                    </div>

                    <div className="col-span-7 center score-container grid grid-cols-3">
                        <div className="col-span-1 center left-player-data">
                            <span title="Player">
                                <img
                                    className="player-img"
                                    src={leftPlayer.image}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                />
                            </span>
                            <span className="player-name">
                                {leftPlayer.username?.length > 7 ? `${leftPlayer.username?.slice(0, 7)}.` : leftPlayer.username}
                            </span>
                        </div>
                        <div className="col-span-1 center score-rounds">
                            <div className="rounds">Round {leftScore + rightScore + 1}</div>
                            <div className="score">
                                <span title="Left player score">{leftScore}</span>
                                <span> - </span>
                                <span title="Right player score">{rightScore}</span>
                            </div>
                        </div>
                        <div className="col-span-1 center right-player-data">
                            <span title="Player">
                                <img
                                    className="player-img"
                                    src={rightPlayer.image}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                />
                            </span>
                            <span className="player-name">
                                {rightPlayer.username?.length > 7 ? `${rightPlayer.username?.slice(0, 7)}.` : rightPlayer.username}
                            </span>
                        </div>
                    </div>

                    <div className="col-span-1 center right-character">
                        <span title="Right Character">
                            {rightPlayer.character == 'Pixie' ? (
                                <img
                                    src={`/Characters/${rightPlayer.character}/GameR.png`}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                // style={{ width: '200px', height: '120px' }}
                                />

                            ) : (
                                <img
                                    src={`/Characters/${rightPlayer.character}/GameR.png`}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                />
                            )}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default Players;