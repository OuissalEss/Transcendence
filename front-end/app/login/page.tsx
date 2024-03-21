import NavBar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import './login.css';

export default function Login() {

  return (
    <div className="flex login-page">
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

      <div className="flex flex-col justify-bottom">
        <div className="grid grid-cols-3 gap-16">
          <div className='col-span-1 right-character'>
            <span title="Character">
              <Image
                className="player-img"
                src="/Characters/Nova/04.png"
                alt=""
                layout="responsive"
                width={10}
                height={10}
              />
            </span>
          </div>

          <div className='col-span-1'>
            <div className="mb-9 t">
              <h1 className="title">
                Log in to Pong Paradise
              </h1>
            </div>

            <div className="gap-4 mb-9">
              <div className="btn transition-all">
                <Link href="http://localhost:3000/auth/42">
                  Continue With
                  <svg
                    className="w-5 h-5 mr-2 svg"
                    fill="currentColor"
                    viewBox="50 -200 960 960"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M32 412.6h330.1V578h164.7V279.1H197.3L526.8-51.1H362.1L32 279.1zM597.9 114.2L762.7-51.1H597.9zM762.7 114.2L597.9 279.1v164.8h164.8V279.1L928 114.2V-51.1H762.7z"></path>
                    <path d="M928 279.1L762.7 443.9H928z"></path>
                  </svg>
                </Link>
              </div>
              <div className="btn transition-all">
                <Link href="http://localhost:3000/auth/google">
                  Continue With
                  <svg
                    className="w-5 h-5 mr-2 svg"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className='flex mc mt-6'>
              <div className='middle-character justify-bottom'>
                <span title="Character">
                  <Image
                    className="player-img"
                    src="/Characters/Pixie/01.png"
                    alt=""
                    layout="responsive"
                    width={10}
                    height={10}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className='col-span-1 left-character'>
            <span title="Character">
              <Image
                className="player-img"
                src="/Characters/Aegon/03.png"
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
  );
}