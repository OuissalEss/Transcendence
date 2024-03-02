import React from "react";
import Image from "next/image";
import Link from "next/link";
import './loading.css'
const GameLoading = () => {

  
    return (
      <div className="container" >
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="gif">
                <img
                  width="400"
                  className="image"
                  src="/loading.gif"
                  alt="Loading"
                />
                <h1 className="text">Your next challenge is loading!!</h1>
                <p className="par"> Meanwhile, discover our characters' captivating stories.</p>
              </div>
            </div>
            <div className="stories col-span-2">
              <span></span>
            </div>
  
        </div>
      </div>
    );
  }


  export default GameLoading;