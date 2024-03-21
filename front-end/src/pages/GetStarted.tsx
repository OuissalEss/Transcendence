import { Link } from 'react-router-dom';


//Images
import Logo from '/logo.png';
import SpinSmash from "/SpinSmash.png"
import HomeBackground from "/home-bg.png";

export default function GetStarted() {
    return (
        <div className="flex home-page">
            <div className='logo-home'>
                <span title="Logo">
                    <img className="sidebar__logo" src={Logo} alt="logo" />
                </span>
            </div>

            <div className="flex">
                <div className="grid grid-cols-3">
                    <div className='col-span-1 left-side'>
                        <div className="spin-smash">
                            <span title="Character">
                                <img className="spin-img" src={SpinSmash} alt="" />
                            </span>
                        </div>

                        <div className="text">
                            <div className="mb-1"> <span>Bounce into Brilliance:</span> </div>
                            <div> <span>Your Destination for Ping Pong Excitement!</span> </div>
                        </div>
                        <div className="btn-home transition-all align-self-end">
                            <Link to="/login">
                                Get Started
                            </Link>
                        </div>
                    </div>

                    <div className='col-span-2'>

                        <div className='flex mc'>
                            <div className='right-side'>
                                <span title="Character">
                                    <img src={HomeBackground} alt="" />
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}