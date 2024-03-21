'use client';


const Players = ({ username, leftScore, rightScore }: { username: string, leftScore: number, rightScore: number }) => {
    return (
        <div className="players-container grid grid-cols-9">

            <div className="col-span-1 center left-character">
                <span title="Left Character">
                    <img
                        src='/Characters/Lumina/GameL.png'
                        alt=""
                    />
                </span>
            </div>

            <div className="col-span-7 center score-container grid grid-cols-3">
                <div className="col-span-1 center left-player-data">
                    <span title="Player">
                        <img
                            className="player-img"
                            src='/Avatars/01.jpeg'
                            alt=""
                        />
                    </span>
                    <span className="player-name">
                        {username.length > 7 ? `${username.slice(0, 7)}.` : username}
                    </span>
                </div>
                <div className="col-span-1 center score-rounds">
                    <div className="rounds">Round 1</div>
                    <div className="score">
                        {/* <span title="Left player score">{leftScore}</span> */}
                        <span title="Left player score">0</span>
                        <span> - </span>
                        <span title="Right player score">{rightScore}</span>
                    </div>
                </div>
                <div className="col-span-1 center right-player-data">
                    <span title="Player">
                        <img
                            className="player-img"
                            src='/Avatars/02.jpeg'
                            alt=""
                        />
                    </span>
                    <span className="player-name">
                        Player2
                    </span>
                </div>
            </div>

            <div className="col-span-1 center right-character">
                <span title="Right Character">
                    <img
                        src='/Characters/Nova/GameR.png'
                        alt=""
                    />
                </span>
            </div>

        </div>
        );
};


export default Players;
