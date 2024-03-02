"use client"
import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import Pong from "./pong/page";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="spinner"></div>
  </div>
);


function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    // Add event listener to the document to handle clicks outside the search results
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        // Click occurred outside the search results, clear them
        setSearchResults([]);
      }
    };

    // Attach the event listener
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchResultsRef]);

  // Simulating search functionality
  const handleSearch = () => {
    // Here you can perform the actual search based on searchTerm
    // For demonstration purposes, we'll just set an array of dummy results
    const dummyResults = ["Result 1", "Result 2", "Result 3","Result 4", "Result 5", "Result 6","Result 7", "Result 8", "Result 9"];
    setSearchResults(dummyResults);
  };

  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // Trigger the search whenever the input changes
    handleSearch(newSearchTerm);
  };

  return (
    <div className="searchBarContainer">
      <div className="searchImg">
          <Image 
            src="/Icons/Search.png"
            alt="search"
            layout="responsive"
            width={500}
            height={500}
          />
      </div>

      {/* Search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search..."
        className="searchInput"
      />

      {/* Display search results above other page components */}
      {searchResults.length > 0 && (
        <div className="searchResults" ref={searchResultsRef}>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}


const liveMatches = [
  {
    host: "Player6",
    guest: "Player2",
    href: "#",
  },
  {
    host: "Player3",
    guest: "Player7",
    href: "#",
  },
  {
    host: "Player8",
    guest: "Player4",
    href: "#",
  },
  {
    host: "Player1",
    guest: "Player2",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
  {
    host: "Player5",
    guest: "Player9",
    href: "#",
  },
];


export default function Game() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="">
        <div className="grid grid-cols-3 header">
              <div className='col-span-1 t'>
                <h1 className='title'>Game</h1>
              </div>

              <div className='col-span-1 text-while'>
                <SearchBar />
              </div>

              <div className='col-span-1 notifs'>
                  <div className="bellDiv">
                        <Image 
                          className="bellImg"
                          src="/Icons/Bell.png"
                          alt="search"
                          layout="responsive"
                          width={500}
                          height={500}
                        />
                  </div>
              </div>

        </div>
        <div className="grid grid-cols-2 gap-9 text-black">
          <div className="game-mode">
            <div className="grid grid-cols-2">
              <div className="mode-text">
                <h3>Online</h3>
                <p>Challenge a random player!</p>
              </div>
              <div className="mode-img">
                <Image 
                    className="mode-char"
                    src="/Characters/Aurora/GameR.png"
                    alt="character"
                    layout="responsive"
                    width={500}
                    height={500}
                />
              </div>

            </div>
            <Link href={{ pathname: "/dashboard/game/pong", query: { mode: 'online' } }} className="mode-btn transition-all">
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
                <Image 
                    className="mode-char"
                    src="/Characters/Pixie/GameR2.png"
                    alt="character"
                    layout="responsive"
                    width={500}
                    height={500}
                />
              </div>

            </div>
            <Link href={{ pathname: "/dashboard/game/pong", query: { mode: 'ai' } }} className="mode-btn transition-all">
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
                <Image 
                    className="mode-char"
                    src="/Characters/Lumina/GameL.png"
                    alt="character"
                    layout="responsive"
                    width={500}
                    height={500}
                />
              </div>

            </div>
            <Link href={{ pathname: "/dashboard/game/pong", query: { mode: 'offline' } }} className="mode-btn transition-all">
              <div>Play now</div>
            </Link>
          </div>
          <div className="p-4 game-mode watch">
            <div className="grid grid-cols-2">
              <div className="mode-text">
                <h3>Watch </h3>
                <p>Watch live plays!</p>
  <div className="mode-img live">

    <ol className="matches">
         {liveMatches.map(({ host, guest}) => {
           return (
             <li className="match grid grid-cols-3">
                <div className="players col-span-2">
                  <span>{host}</span>
                  <span> vs </span>
                  <span>{guest} </span>
                </div>
                <div>
                  <Link href="" className="live-btn transition-all">
                    <span> Watch </span>
                  </Link>
                </div>
             </li>
             );
         })}
   </ol>

  </div>
              </div>
              <div className="mode-img">
                <Image 
                    className="mode-char"
                    src="/Characters/Aegon/GameR.png"
                    alt="character"
                    layout="responsive"
                    width={500}
                    height={500}
                />
              </div>

            </div>
          </div>
        </div>
      {/* {isLoading && <LoadingSpinner />}
      {selectedMode && !isLoading && <Pong mode={selectedMode} />} */}
    </div>
  );
}
