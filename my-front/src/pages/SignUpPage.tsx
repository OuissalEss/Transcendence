import Layout from '../components/layout';
import { ChangeEvent, useState } from 'react';
import AvatarSelection from '../components/auth/signup/AvatarSelection';
import FormInput from '../components/auth/signup/FormInput';
import UserCard from '../components/auth/signup/UserCard';

function SignUpPageContainer() {
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
    const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);


	const avatarList = [
		'../../../../public/assets/Avatars/01.jpeg',
		'../../../../public/assets/Avatars/02.jpeg',
		'../../../../public/assets/Avatars/03.jpeg',
		'../../../../public/assets/Avatars/04.png',
		'../../../../public/assets/Avatars/05.png',
		'../../../../public/assets/Avatars/06.png',
		'../../../../public/assets/Avatars/07.jpeg',
		'../../../../public/assets/Avatars/08.jpeg',
		'../../../../public/assets/Avatars/09.png',
		'../../../../public/assets/Avatars/10.jpeg',
		'../../../../public/assets/Avatars/11.png',
		'../../../../public/assets/Avatars/12.jpeg',
		'../../../../public/assets/Avatars/13.jpeg',
		'../../../../public/assets/Avatars/14.png',
		'../../../../public/assets/Avatars/15.png',
		'../../../../public/assets/Avatars/16.jpeg',
		'../../../../public/assets/Avatars/17.jpeg',
		'../../../../public/assets/Avatars/18.png',
	  ];

	const validateForm = () => {
        if (username.trim() !== '' && email.trim() !== '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
		validateForm();
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
		validateForm();
    };

    const handleLeftChevronClick = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex - 1 + avatarList.length) % avatarList.length);
    };

    const handleRightChevronClick = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % avatarList.length);
    };

    return (
        <>
			<Layout />
            <div className="BlurryRectangle flex justify-center items-center">
				<div className="flex flex-col items-center justify-center">
          			<div className="w-48 h-48 flex justify-center items-center">
						<AvatarSelection
							currentCharacterIndex={currentCharacterIndex}
							handleLeftChevronClick={handleLeftChevronClick}
							handleRightChevronClick={handleRightChevronClick}
							avatarList={avatarList}
						/>
						<FormInput
							username={username}
							avatar={avatarList[currentCharacterIndex]}
							email={email}
							isFormValid={isFormValid}
							handleUsernameChange={handleUsernameChange}
							handleEmailChange={handleEmailChange}
						/>
						<UserCard avatar={avatarList[currentCharacterIndex]} userName={username} />
					</div>
				</div>
            </div>
        </>
    );
}

export default SignUpPageContainer;
