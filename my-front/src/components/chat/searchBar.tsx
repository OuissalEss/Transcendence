"use client"
import React, { useEffect, useRef, useState } from "react";
import search from '../../../public/assets/Icons/Search.png';
import './chat.css';

function SearchBar() {

return (
	<div className="searchBarContainer">
		<div className="searchImg">
			<img
				src={search}
				alt="search"
				style={{ width: '100px', height: "auto" }}
			/>
		</div>

		{/* Search input */}
		<input
			type="text"
			placeholder="Search..."
			className="searchInput"
		/>
	</div>
);
}

export default SearchBar;
