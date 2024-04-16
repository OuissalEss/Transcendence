import { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import '../assets/game_ended.css'
import '../App.css';
import User from "../types/user-interface";
import Loading from "./Loading";

interface FinishedGameData {
    Id: string,
    Username: string,
    Image: string,
    Character: string,
    Host: boolean,
    HostScore: number,
    GuestScore: number,
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

const GameEnded = ({ gameMode, gameData }: { gameMode: any, gameData: FinishedGameData | null }) => {
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
        id: '1',
        username: 'Player1',
        image: '/Avatars/02.jpeg',
        character: '1',
    };
    let rightPlayer: player = {
        id: '2',
        username: 'Player2',
        image: '/Avatars/01.jpeg',
        character: '2',
    };
    if (gameData) {
        // left
        rightPlayer.id = gameData.Id;
        rightPlayer.username = gameData.Username;
        rightPlayer.image = gameData.Image;
        rightPlayer.character = gameData.Character;
        // right
        leftPlayer.id = userData?.id;
        leftPlayer.username = userData?.username;
        leftPlayer.image = userData?.avatar?.filename;
        leftPlayer.character = userData?.character;
    }
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
    let leftScore = gameData?.HostScore || 0;
    let rightScore = gameData?.GuestScore || 0;
    if (gameData?.Host == false) {
        rightScore = gameData.HostScore;
        leftScore = gameData.GuestScore;
    }
    if (isLoading) return <Loading />
    return (
        <div className="containerGE">
            <div className='flex center'>
                <h1>Game Ended</h1>
            </div>
            <div>
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
                            {leftPlayer.username?.length > 9 ? `${leftPlayer.username?.slice(0, 9)}.` : leftPlayer.username}
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
                            {rightPlayer.username?.length > 9 ? `${rightPlayer.username?.slice(0, 9)}.` : rightPlayer.username}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameEnded;