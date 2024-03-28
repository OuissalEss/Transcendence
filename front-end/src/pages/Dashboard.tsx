'use client';

import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

import '../assets/dashboard.css';
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
import {useSocket} from "../App.tsx";


const characters = [
  { name: 'Aurora', Left: AuroraLeft, Right: AuroraRight, infos: AuroraInfos },
  { name: 'Luna', Left: LunaLeft, Right: LunaRight, infos: LunaInfos },
  { name: 'Lumina', Left: LuminaLeft, Right: LuminaRight, infos: LuminaInfos },
  { name: 'Nova', Left: NovaLeft, Right: NovaRight, infos: NovaInfos },
  { name: 'Starlight', Left: StarlightLeft, Right: StarlightRight, infos: StarlightInfos },
  { name: 'Aegon', Left: AegonLeft, Right: AegonRight, infos: AegonInfos },
];

interface TopFive {
  id: string,
  name: string,
  image: string,
  xp: number,
  wins: number,
  leaderboard: string
}

const topFiveTest = [
  { id: '', name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard1 },
  { id: '', name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard2 },
  { id: '', name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard3 },
  { id: '', name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard4 },
  { id: '', name: '', image: '', xp: 0, wins: 0, leaderboard: Leaderboard5 },
];
export default function Dashboard() {
  const { users, userData } = useSocket();
  const [topFive, setTopFive] = useState<TopFive[]>(); // State variable for top five players


  useEffect(() => {
    if (!users || !userData) return;
    let updatedTopFive: TopFive[] = users.slice(0, 5).map((player) => ({
      id: player.id,
      name: player.username,
      image: player.avatar?.filename || '/Avatars/default.jpeg',
      xp: player.xp,
      wins: player.winner.length,
      leaderboard: Leaderboard1
    }));
    for(let i = 0; i < 5; i++){
      topFiveTest[i].id = updatedTopFive[i]?.id;
      topFiveTest[i].name = updatedTopFive[i]?.name;
      topFiveTest[i].image = updatedTopFive[i]?.image;
      topFiveTest[i].xp = updatedTopFive[i]?.xp;
      topFiveTest[i].wins = updatedTopFive[i]?.wins;
    }

    setTopFive(topFiveTest);
  }, [users, userData]);

  const index = characters.findIndex(character => character.name === userData?.character);
  const myCharacter = characters[index];

  return (
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
              <h1>Welcome, {userData?.username}!</h1>
            </div>
            <div className="Character">
              <h1>Character</h1>
              <div className="CharacterBar">
                <p>{myCharacter?.name}</p>
              </div>
            </div>
            <div className="TopFivePlayers">
                <h1>Top 5 players</h1>

                {topFive?.map((player, index) => (
                  player.name ? (
                    <Link key={index} to={`/profiles?id=${player.id}`}>
                      <div className={`AvatarContainer${index + 1}`}>
                        <h1>{player.name}</h1>
                        <p>{player.xp} xp | {player.wins} wins</p>
                          <img
                            src={player.image}
                            alt={`Top${index + 1}`}
                            className={`Top${index + 1}`}
                          />
                          {index < 3 &&
                            <img
                              src={player.leaderboard}
                              className={`Leaderboard${index + 1}`}
                              alt={`Leaderboard${index + 1}`}
                            />
                          }
                      </div>
                    </Link>
                  ) : null
                ))}
            </div>

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
            <img src={myCharacter?.Left} className="DashLeft" alt="DashLeft" />
            <img src={myCharacter?.Right} className="DashRight" alt="DashRight" />
            <img src={myCharacter?.infos} className="AuroraInfos" alt="AuroraInfos" />
          </header>
        </div>
      </main>
  )
}

