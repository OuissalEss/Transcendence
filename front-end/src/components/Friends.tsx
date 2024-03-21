'use client';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import User from "../types/user-interface";
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
import { useQuery, gql, OperationVariables } from "@apollo/client";


const FriendsListtmp = [
    {
        username: "Stella",
        image: "/Avatars/02.jpeg",
        status: "ONLINE",
    },
    {
        username: "Slan",
        image: "/Avatars/03.jpeg",
        status: "OFFLINE",
    },
    {
        username: "Wafae",
        image: "/Avatars/05.png",
        status: "ONLINE",
    },
    {
        username: "James",
        image: "/Avatars/12.jpeg",
        status: "OFFLINE",
    },
    {
        username: "Jinxx",
        image: "/Avatars/07.jpeg",
        status: "INGAME",
    },
    {
        username: "Linda",
        image: "/Avatars/09.png",
        status: "ONLINE",
    },
    {
        username: "Robert",
        image: "/Avatars/13.jpeg",
        status: "OFFLINE",
    },
    {
        username: "John",
        image: "/Avatars/15.png",
        status: "ONLINE",
    },
    {
        username: "Jessica89",
        image: "/Avatars/08.jpeg",
        status: "INGAME",
    },
    {
        username: "Davidosias123",
        image: "/Avatars/18.png",
        status: "ONLINE",
    },
];

const Friends = () => {
    const [userData, setUserData] = useState<User>();
    const [friends, setFriends] = useState<User[]>();
    const [isLoading, setLoading] = useState(true);


    const token: string | undefined = Cookies.get('token');
    const decodedToken = jwtDecode(token || '');
    const id = decodedToken.sub;

    const USER_DATA = gql`
        query($user_id: String!) { 
            getUserFriends {
                id
                username
                status
                avatar{filename}
            }
            getUserById(id: $user_id) {
                id
                username
                avatar{filename}
            }
        }
    `;

    const resutls = useQuery(USER_DATA, {
        variables: { user_id: id }
    });

    useEffect(() => {
        try {

            const { data, loading, error } = resutls;

            if (loading) setLoading(true);
            if (error) {
                throw new Error('Failed to fetch user data');
            }
            if (data) {
                setUserData(data.getUserById);
                setFriends(data.getUserFriends);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }

    }, [resutls]);

    if (isLoading) return <p></p>
    if (!userData) return <p></p>
    if (!friends) return <p></p>

    console.log("FRIENDS == ", friends);

    let FriendsList = friends.map((friend: User) => ({
        id: friend.id,
        username: friend.username,
        status: friend.status,
        image: friend.avatar ? friend.avatar.filename : ''
    }));
    console.log("new data ===== ", FriendsList);



    return (
        <div>
            <menu>
                <div className="friends friends_wrapper">
                    <div className="friends_top">
                        <Link className='' to='/profile' >
                            <span className="my-pic" title='My Profile'>
                                <img className="friend-img" src={userData.avatar.filename} alt={""} />
                            </span>
                        </Link>
                    </div>
                    <ul className="friends_list">
                    {FriendsList.map(({ username,  image , status}, index) => {
                            return (
                                <li className="friends_item" key={index} title={status}>
                                    <div className="relative">
                                        <div className="friend-icon">
                                            <span >
                                                <img className={`friend-img ${status}`} src={image} alt={""}/>
                                            </span>
                                        </div>
                                        <div className="friend-name" title={username}>
                                            <span>{username.length > 9 ? `${username.slice(0, 9)}.` : username}</span>
                                        </div>
                                        <div className={`cercle s ${status}`}></div>
                                        <div className="cercle status"></div>
                                    </div>
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