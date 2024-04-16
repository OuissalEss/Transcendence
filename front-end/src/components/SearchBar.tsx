import { useEffect, useRef, useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import User from '../types/user-interface';
import { Link } from "react-router-dom";

const SEARCH_USERS = gql`
    query SearchUsers($searchQuery: String!) {
      searchUsers(query: $searchQuery) {
          id
          username
          avatar{filename}
      }
    }
`;

const SearchBar = () => {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [inputFocused, setInputFocused] = useState<boolean>(false);

    const [searchUsers, { data }] = useLazyQuery(SEARCH_USERS);

    useEffect(() => {
        if (data) {
            setSearchResults(data.searchUsers);
        }
    }, [data]);

    // useEffect(() => {
    //     // Add event listener to the document to handle clicks outside the search results
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (
    //             searchResultsRef.current &&
    //             !searchResultsRef.current.contains(event.target as Node) &&
    //             !inputFocused
    //         ) {
    //             // Click occurred outside the search results and input is not focused, clear them
    //             setSearchResults([]);
    //         }
    //     };
    
    //     // Attach the event listener
    //     document.addEventListener("click", handleClickOutside);
    
    //     // Clean up the event listener on component unmount
    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };
    // }, [inputFocused]); // Include inputFocused in the dependency array
    

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setQuery(query);
        if (query === ''){
            setSearchResults([]);
            return;
        }
        searchUsers({ variables: { searchQuery: query } });
    };

    const handleInputFocus = () => {
        setInputFocused(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setInputFocused(false);
        }, 200);
    };

    return (
        <div className="searchBarContainer">
            <div className="searchImg">
                <img
                    src="/Icons/Search2.png"
                    alt="search"
                    style={{ width: '100%', height: "auto" }}
                    referrerPolicy="no-referrer"
                />
            </div>

            {/* Search input */}
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Search for player"
                className="searchInput"
            />

            {/* Display search results */}
            {(query && inputFocused && searchResults.length > 0) && (
                <div className="searchResults" ref={searchResultsRef}>
                    <ul>
                        {searchResults.map((user: User) => (
                            <li key={user.id}>
                                <Link to={`/profiles?id=${user.id}`}>
                                    <img src={user.avatar.filename} alt="search" referrerPolicy="no-referrer"/>
                                    <span> {user.username}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;