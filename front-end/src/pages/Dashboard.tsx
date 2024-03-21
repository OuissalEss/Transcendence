'use client';

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import DashboardLayout from "../layouts/LayoutDefault";
import SearchBar from "../components/SearchBar";
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import User from "../types/user-interface";
import { useQuery, gql, OperationVariables } from "@apollo/client";
import { Link } from "react-router-dom";

// import '../assets/login.css';
import '../assets/dashboard.css';


import Notif from  "/Icons/Bell.png"
// Game modes
import OnlinePic from '/Characters/Aurora/Challenge.png';
import OfflinePic from '/Characters/Lumina/GameL.png';
import Robot from '/Characters/Pixie/01.png';
// Leaderboards
import Leaderboard1 from '/Leaderboard/Leaderboard1.png';
import Leaderboard2 from '/Leaderboard/Leaderboard2.png';
import Leaderboard3 from '/Leaderboard/Leaderboard3.png';
import Leaderboard4 from '/Leaderboard/Leaderboard4.png';
import Leaderboard5 from '/Leaderboard/Leaderboard5.png';
// Characters
  // Aurora
  import AuroraLeft from '/Characters/Aurora/01.png';
  import AuroraRight from '/Characters/Aurora/02.png';
  import AuroraInfos from '/Characters/Aurora/Infos.png';
  // Lumina
  import LuminaLeft from '/Characters/Lumina/01.png';
  import LuminaRight from '/Characters/Lumina/03.png';
  import LuminaInfos from '/Characters/Lumina/Infos.png';
  // Luna
  import LunaLeft from '/Characters/Luna/02.png';
  import LunaRight from '/Characters/Luna/03.png';
  import LunaInfos from '/Characters/Luna/Infos.png';
  // Nova
  import NovaLeft from '/Characters/Nova/03.png';
  import NovaRight from '/Characters/Nova/01.png';
  import NovaInfos from '/Characters/Nova/Infos.png';
  // Starlight
  import StarlightLeft from '/Characters/Starlight/02.png';
  import StarlightRight from '/Characters/Starlight/01.png';
  import StarlightInfos from '/Characters/Starlight/Infos.png';
  // Aegon
  import AegonLeft from '/Characters/Aegon/02.png';
  import AegonRight from '/Characters/Aegon/01.png';
  import AegonInfos from '/Characters/Aegon/Infos.png';
import Notifications from "../components/Notifications";



const characters = [
  { name: 'Aurora', Left: AuroraLeft, Right: AuroraRight, infos: AuroraInfos },
  { name: 'Luna', Left: LunaLeft, Right: LunaRight, infos: LunaInfos },
  { name: 'Lumina', Left: LuminaLeft, Right: LuminaRight, infos: LuminaInfos },
  { name: 'Nova', Left: NovaLeft, Right: NovaRight, infos: NovaInfos },
  { name: 'Starlight', Left: StarlightLeft, Right: StarlightRight, infos: StarlightInfos },
  { name: 'Aegon', Left: AegonLeft, Right: AegonRight, infos: AegonInfos },
];

let topFive = [
    { name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard1 },
    { name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard2 },
    { name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard3 },
    { name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard4 },
    { name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard5 },
];

export default function Dashboard() {
    const [userData, setUserData] = useState<User>();
    const [topPlayers, setTopPlayers] = useState<User[]>();
    const [isLoading, setLoading] = useState(true);


    const token: string | undefined = Cookies.get('token');
    const decodedToken = jwtDecode(token || '');
    const id = decodedToken.sub;

    const USER_DATA = gql`
        query($user_id: String!) {
          getAllUsers {
              id
              username
              avatar{filename}
              xp
          }
          getUserById(id: $user_id) {
              id
              username
              character
              avatar{filename}
          }
      }
    `;

    const resutls = useQuery(USER_DATA, {
        variables: { user_id: id }
    });

    useEffect(() => {
        try {

            const { data, loading, error } = resutls;

            if (loading) setLoading(true);
            if (error) {
                throw new Error('Failed to fetch user data');
            }
            if (data) {
                setUserData(data.getUserById);
                setTopPlayers(data.getAllUsers);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }

    }, [resutls]);

    // Simulate a longer loading time (e.g., 1 seconds)
    // const delay = 0;
    // const timer = setTimeout(() => { setLoading(false)}, delay);


    if (isLoading) {
        return (
            <DashboardLayout>
                <Loading />
            </DashboardLayout>
            );
    }
    if (!userData) return <p></p>
    if (!topPlayers) return <p></p>

for (let i = 0; i < Math.min(topPlayers.length, 5); i++) {
    topFive[i] = {
        name: topPlayers[i].username,
        image: topPlayers[i].avatar.filename,
        xp: topPlayers[i].xp,
        wins: 0,
        leaderboard: topFive[i].leaderboard
    };
}
    // console.log("userData = ", userData);

    const index = characters.findIndex(character => character.name === userData.character);
    console.log("CHARACTER = ", index);
    console.log("CHARACTER = ", characters[index]);

    const myCharacter = characters[index];

    return (
        <DashboardLayout>
            <main className="flex flex-col items-center justify-between p-24 ">

    <div className="Login">
      <header className="Login-header">
      <div className="SearchBarD">
                        <SearchBar />
      </div>
      <div className="NotificationBarD">
                        <Notifications />
      </div>
      <div className="WelcomeMssg">
        <h1>Welcome, {userData.username}!</h1>
      </div>
      <div className="Character">
        <h1>Character</h1>
        <div className="CharacterBar">
          <p>{myCharacter.name}</p>
      </div> 
      </div>
      <div className="TopFivePlayers">
        <h1>Top 5 players</h1>

        {topFive.map((player, index) => (
            player.name !== '' ? (
                <img
                key={index}
                src={player.image}
                alt={`Top${index + 1}`}
                className={`Top${index + 1}`}
                />
            ) : null
        ))}
      </div>

        {topFive.filter(player => player.name !== '').map((player, index) => (
            <div key={index} className={`AvatarContainer${index + 1}`}>
                <h1>{player.name}</h1>
                <p>{player.xp} xp | {player.wins} wins</p>
            </div>
        ))}

      <div className="Question">
        <h1>Up for a game?</h1>
      </div>
      <div className="OnlineBar">
       <h1>Online</h1>
       <p>Challenge a <br></br> random player!</p>
        </div>
      <div className="OfflineBar">
        <h1>Offline</h1>
       <p>Challenge a <br></br> friend offline!</p>
      </div>
      <div className="RobotBar">
        <h1>Robot</h1>
        <p>Test your skills<br></br>against a robot!</p>
      </div>
      <Link to="/game/pong?mode=online">
          <div className="PlayNow1">
            <p>Play now</p>
          </div>
      </Link>
      <Link to="/game/pong?mode=offline">
          <div className="PlayNow2">
            <p>Play now</p>
          </div>
      </Link>
      <Link to="/game/pong?mode=ai">
          <div className="PlayNow3">
            <p>Play now</p>
          </div>
      </Link>
        <img src={OnlinePic} alt="OnlinePic" className="OnlinePic" /> 
        <img src={OfflinePic} alt="OfflinePic" className="OfflinePic" />
        <img src={Robot} alt="Robot" className="RobotPic" />
        <img src={myCharacter.Left} className="DashLeft" alt="DashLeft" />
        <img src={myCharacter.Right} className="DashRight" alt="DashRight" />
        <img src={myCharacter.infos} className="AuroraInfos" alt="AuroraInfos" />

        {topFive.map((player, index) => (
            player.name !== '' && index < 3 ? (
                <img
                    key={index}
                    src={player.leaderboard}
                    className={`Leaderboard${index + 1}`}
                    alt={`Leaderboard${index + 1}`}
                />
            ) : null
        ))}
  
      </header>
    </div>
            </main>
        </DashboardLayout>
        )
}

