"use client"
import { Link } from "react-router-dom";



import '../../assets/game.css'
import SearchBar from "../../components/SearchBar";
import Notifications from "../../components/Notifications";


const liveMatches = null;
// [
//     {
//         host: "OuissalEs",
//         guest: "OuissalEss",
//         href: "#",
//     },
// ];


export default function Game() {
    return (
        <div className="main-game-page">
            <div className="grid grid-cols-3 header">
                <div className='col-span-1 t'>
                    <h1 className='title'>Game</h1>
                </div>

                <div className='col-span-1 text-while'>
                    <SearchBar />
                </div>

                <div className='col-span-1'>
                    <Notifications />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-y-11 text-black modes">
                <div className="p-4 game-mode">
                    <div className="grid grid-cols-2">
                        <div className="mode-text">
                            <h3>Online</h3>
                            <p>Challenge a random player!</p>
                        </div>
                        <div className="mode-img">
                            <img
                                className="mode-char"
                                src="/Characters/Aurora/GameR.png"
                                alt="character"
                            />
                        </div>

                    </div>
                    <Link to="/game/pong?mode=online" className="mode-btn transition-all">
                        <div>Play now</div>
                    </Link>
                </div>
                <div className="p-4 game-mode robot">
                    <div className="grid grid-cols-2">
                        <div className="mode-text">
                            <h3>Robot</h3>
                            <p>Test your skills against a robot!</p>
                        </div>
                        <div className="mode-img">
                            <img
                                className="mode-char"
                                src="/Characters/Pixie/GameR2.png"
                                alt="character"
                            />
                        </div>

                    </div>
                    <Link to="/game/pong?mode=ai" className="mode-btn transition-all">
                        <div>Play now</div>
                    </Link>
                </div>
                <div className="p-4 game-mode">
                    <div className="grid grid-cols-2">
                        <div className="mode-text">
                            <h3>Offline</h3>
                            <p>Challenge a friend offline!</p>
                        </div>
                        <div className="mode-img">
                            <img
                                className="mode-char"
                                src="/Characters/Lumina/GameL.png"
                                alt="character"
                            />
                        </div>

                    </div>
                    <Link to="/game/pong?mode=offline" className="mode-btn transition-all">
                        <div>Play now</div>
                    </Link>
                </div>
                <div className="p-4 game-mode">
                    <div className="grid grid-cols-2">
                        <div className="mode-text">
                            <h3>Elite</h3>
                            <p>Push your limits with our advenced mode!</p>
                        </div>
                        <div className="mode-img">
                            <img
                                className="mode-char"
                                src="/Characters/Aegon/GameR.png"
                                alt="character"
                            />
                        </div>

                    </div>
                    <Link to="/game/pong?mode=alter" className="mode-btn transition-all">
                        <div>Play now</div>
                    </Link>
                </div>
                {/* <div className="p-4 game-mode watch">
                        <div className="grid grid-cols-2">
                            <div className="mode-text">
                                <h3>Watch </h3>
                                <p>Watch live plays!</p>
                                <div className="mode-img live">

                                    <ol className="matches">
                                        {liveMatches &&
                                            liveMatches.map(({ host, guest }, index) => {
                                                return (
                                                    <li key={index} className="match grid grid-cols-3">
                                                        <div className="players col-span-2">
                                                            <span className="text-white">{host}</span>
                                                            <span> vs </span>
                                                            <span className="text-white">{guest} </span>
                                                        </div>
                                                        <div>
                                                            <Link to="" className="live-btn transition-all">
                                                                <span title="watch">
                                                                    <img className="eyesIcon" src="/Icons/eyes2.png" alt="character" />
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                        
                                    </ol>

                                </div>
                            </div>
                            <div className="mode-img">
                                <img
                                    className="mode-char"
                                    src="/Characters/Aegon/GameR.png"
                                    alt="character"
                                />
                            </div>

                        </div>
                    </div> */}
            </div>
            {/* {isLoading && <LoadingSpinner />}
      {selectedMode && !isLoading && <Pong mode={selectedMode} />} */}
        </div>
    );
}