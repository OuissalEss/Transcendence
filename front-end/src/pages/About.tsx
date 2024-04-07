
import LeftMssg from '/LeftMssg.png';
import RightMssg from '/RightMssg.png';
import FirstWithB from '/Achievements/FirstfWithB.png';
import FiveWithB from '/Achievements/FiveWithB.png';
import RobotWithB from '/Achievements/RobotWithB.png';
import RoomWithB from '/Achievements/RoomWithB.png';
import ThreeWithB from '/Achievements/ThreeWithB.png';
import WelcomeWithB from '/Achievements/WelcomeWithB.png';
import '../assets/about.css'

export default function About() {

    return(
        <div className="AboutUsPage flex">
            <div className="grid grid-cols-2">
                <div className="col-span-1">
                    <div className="InfoAchievements">Achievements</div>

                    <div className="InfoAchievementBar">
                        <div className="IAchievement">
                            <p>Welcome to the Arena: <br/>Log in for the first time <br/>and step onto the ping pong arena. <br/>You're now part of the game community!</p>
                            <img src={WelcomeWithB} alt="Welcome Achievement" />
                        </div>
                        <div className="IAchievement">
                            <p>Robo-Champion: <br/>Outsmarted the machine!<br/>Secure victory against a robot opponent<br/> and prove you're the ping pong master, human-style.</p>
                            <img src={RobotWithB} alt="Robot Achievement" />
                        </div>
                        <div className="IAchievement">
                            <p>Social Paddler: <br/>Make your first friend! <br/>Connect with another player to unlock this achievement<br/> and expand your ping pong network.</p>
                            <img src={FirstWithB} alt="First Friend Achievement" />
                        </div>
                        <div className="IAchievement">
                            <p>Winning Streak:<br/> Win five matches in a row without losing.</p>
                            <img src={FiveWithB} alt="Five Win Streak Achievement" />
                        </div>
                        <div className="IAchievement">
                            <p>Loyal Opponent: <br/>Play a match against the same friend three times. <br/>Friendly rivalries make the game more exciting!</p>
                            <img src={ThreeWithB} alt="Three Matches Against Same Friend Achievement" />
                        </div>
                        <div className="IAchievement">
                            <p>Team Spirit:<br/> Join a ping pong room for the first time. <br/>Teamwork makes the dream work!</p>
                            <img src={RoomWithB} alt="Join Room Achievement" />
                        </div>
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="AboutUs">About us 💕</div>

                    <div className="aboutContainer">
                        <div className="AboutUsOuissal">
                            <h1>Ouissal 🐾</h1>
                            <img src={RightMssg} className="RightMssg1"alt="RightMssg" />
                        </div>
                        <div className="AboutUsZineb">
                            <h1>Zineb ✨</h1>
                            <img src={LeftMssg} className="LeftMssg1" alt="LeftMssg" />
                        </div>
                        <div className="AboutUsSalma">
                            <h1>Salma 🦋</h1>
                            <img src={RightMssg} className="RightMssg2" alt="RightMssg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}