import NavBar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import './style/home.css';

export default function Home() {

  return (
    <div className="flex home-page">
      <div className='logo'>
        <span title="Logo">
          <Image
            title="Logo"
            className="sidebar__logo"
            src="/logo.png"
            alt="logo"
            layout="responsive"
            width={10}
            height={10}
          />
        </span>
      </div>

      <div className="flex">
        <div className="grid grid-cols-3">
          <div className='col-span-1 left-side'>
            <div className="spin-smash">
              <span title="Character">
                <Image
                  className="spin-img" src="/SpinSmash.png"
                  layout="responsive" width={10} height={10} alt={''} />
              </span>
            </div>

            <div className="text">
              <div className="mb-1"> <span>Bounce into Brilliance:</span> </div>
              <div> <span>Your Destination for Ping Pong Excitement!</span> </div>
            </div>

            <Link href="http://localhost:3001/login">
              <div className="btn transition-all align-self-end">
                Get Started
              </div>
            </Link>
          </div>

          <div className='col-span-2'>

            <div className='flex mc'>
              <div className='right-side'>
                <span title="Character">
                  <Image
                    className="player-img"
                    src="/home-bg.png"
                    alt=""
                    layout="responsive"
                    width={10}
                    height={10}
                  />
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
