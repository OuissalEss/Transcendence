// AvatarSelection.tsx
import React from 'react';
import ChevronLeft from '../../../../public/assets/Icons/ChevronLeft.png';
import ChevronRight from '../../../../public/assets/Icons/ChevronRight.png';
import './signUp.css';


interface AvatarSelectionProps {
    currentCharacterIndex: number;
    handleLeftChevronClick: () => void;
    handleRightChevronClick: () => void;
    avatarList: string[];
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
    currentCharacterIndex,
    handleLeftChevronClick,
    handleRightChevronClick,
    avatarList
}) => {
    return (
		<>
		  <img
			src={ChevronLeft}
			className="ChevronLeft"
			alt="ChevronLeft"
			onClick={handleLeftChevronClick}
		  />
		  <div className="AvatarContainer">
			<img src={avatarList[currentCharacterIndex]} className="Avatar" alt="Avatar" />
		  </div>
		  <img
			src={ChevronRight}
			className="ChevronRight"
			alt="ChevronRight"
			onClick={handleRightChevronClick}
		  />
		</>
	  );
};

export default AvatarSelection;
