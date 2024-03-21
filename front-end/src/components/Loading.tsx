
import { useState, useEffect } from 'react';
import '../assets/loading.css';

const Loading = () => {
    return (
        <div className="container p-6" >
            <div className="grid gap-8">
                <div className="col-span-1">
                    <div className="gifL">
                        <img
                            width="400"
                            height="400"
                            className="image"
                            src="/loading.gif"
                            alt="Loading"
                        />
                        <h1 className="text-loading">Almost there, just a moment . . .</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loading;