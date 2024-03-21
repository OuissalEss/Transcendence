import { useEffect, useRef, useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import User from '../types/user-interface';

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
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [inputFocused, setInputFocused] = useState<boolean>(false);

    const [searchUsers, { loading, data }] = useLazyQuery(SEARCH_USERS);

    useEffect(() => {
        if (data) {
            setSearchResults(data.searchUsers);
        }
    }, [data]);

    useEffect(() => {
        // Add event listener to the document to handle clicks outside the search results
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target as Node) &&
                !inputFocused
            ) {
                // Click occurred outside the search results and input is not focused, clear them
                setSearchResults([]);
            }
        };
    
        // Attach the event listener
        document.addEventListener("click", handleClickOutside);
    
        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [inputFocused]); // Include inputFocused in the dependency array
    

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
        setInputFocused(false);
    };

    return (
        <div className="searchBarContainer">
            <div className="searchImg">
                <img
                    src="/Icons/Search.png"
                    alt="search"
                    style={{ width: '100%', height: "auto" }}
                />
            </div>

            {/* Search input */}
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Search..."
                className="searchInput"
            />

            {/* Display search results */}
            {(query && inputFocused && searchResults.length > 0) && (
                <div className="searchResults" ref={searchResultsRef}>
                    <ul>
                        {searchResults.map((user: User) => (
                            <li key={user.id}>
                                <img src={user.avatar.filename} alt="search" />
                                <span> {user.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
