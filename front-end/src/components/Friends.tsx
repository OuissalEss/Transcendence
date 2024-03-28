'use client';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import User from "../types/user-interface";
import { useQuery, gql } from "@apollo/client";
import {useAuth} from "../provider/authProvider.tsx";
import {useSocket} from "../App.tsx";

const USER_DATA = gql`
        query {
            getUserFriends {
                id
                username
                status
                avatar{filename}
            }
            getUserInfo {
                id
                username
                avatar{filename}
            }
        }
    `;

interface Friend {
    id: string,
    username: string,
    status: string,
    image: string,
}
const Friends = () => {
    const { friends, userData } = useSocket();
    const [FriendsList, setFriendsList] = useState<Friend[]>([]);

    useEffect(() => {
        if (!friends) return;

        const updatedFriendsList: Friend[] = friends.map((friend) => ({
            id: friend.id,
            username: friend.username,
            status: friend.status,
            image: friend.avatar?.filename || ''
        }));
        setFriendsList(updatedFriendsList);
    }, [friends]);

    return (
        <div>
            <menu>
                <div className="friends friends_wrapper">
                    <div className="friends_top">
                        <Link className='' to='/myprofile' >
                            <span className="my-pic" title='My Profile'>
                                <img className="friend-img" src={userData?.avatar?.filename} alt={""} />
                            </span>
                        </Link>
                    </div>
                    <ul className="friends_list">
                        {FriendsList.map(({ id, username, image, status }, index) => {
                            return (
                                <li className="friends_item" key={index} title={status}>
                                    <Link to={`/profiles?id=${id}`}>
                                        <div className="relative">
                                            <div className="friend-icon">
                                                <span >
                                                    <img className={`friend-img ${status}`} src={image} alt={""} />
                                                </span>
                                            </div>
                                            <div className="friend-name" title={username}>
                                                <span>{username.length > 9 ? `${username.slice(0, 9)}.` : username}</span>
                                            </div>
                                            <div className={`cercle s ${status}`}></div>
                                            <div className="cercle status"></div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </menu>
        </div>
    );
};

export default Friends;