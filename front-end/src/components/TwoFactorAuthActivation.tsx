import { useState, useEffect, useRef } from 'react';
import { useAuth } from "../provider/authProvider.tsx";
import QRCode from 'qrcode.react'; // Import QRCode library
import copyIcon from "/Icons/copy1.png"
import '../assets/tfactive.css'
import Cookies from "js-cookie";
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/react-hooks'

const TwoFactorAuthentication = ({ onClose }: {onClose: any}) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const { token, setToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        // Fetch QR code when component mounts
        requestQrCode();
    }, []); // Empty dependency array ensures the effect runs only once

    function copyCodeToClipboard() {
        const codeDiv = document.querySelector('.codeValue');
        const codeText = codeDiv?.textContent;

        navigator.clipboard.writeText(codeText ? codeText : '')
            .then(() => {
                alert("Code copied to clipboard!");
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    // Function to request and display QR code
    const requestQrCode = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('http://localhost:3000/2fa/generate-qr', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const { code, imageUrl } = await response.json();
                setQrCodeUrl(imageUrl);
                setSecret(code); // Set the secret received from the server
            } else {
                setError('Failed to fetch QR code');
            }
        } catch (error) {
            console.error('Error fetching QR code:', error);
            setError('An error occurred while fetching QR code');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle activation button click
    const handleActivate = async () => {
        try {
            const response = await fetch('http://localhost:3000/2fa/turn-on-qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: verificationCode })
            });

            if (response.ok) {
                const { accessToken } = await response.json();
                Cookies.set('token', accessToken.access_token)
                alert('2FA activated successfully');
                window.location.reload();
            } else {
                alert('Failed to activate 2FA');
            }
        } catch (error) {
            console.error('Error activating 2FA:', error);
            alert('An error occurred while activating 2FA');
        }
    };

    const [inputs, setInputs] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const handleInputChange = (index, e) => {
        const { value } = e.target;
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
        setVerificationCode(newInputs.join(''));
        // Move focus to the next input
        if (value !== '' && index < inputs.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && inputs[index] === '' && index > 0) {
            // Move focus to the previous input on Backspace press
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <section className="tfaA">
            <div className="tfaPageA">
                <div className="flex tfaContainerA">

                    <div className="activate grid grid-cols-2">
                        <div className="qrCode">
                            <h1>Scan this QR code</h1>
                            {loading ? (
                                <p>Loading QR code...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : (
                                <QRCode className='qrImg' value={qrCodeUrl} /> // Display the QR code using the QRCode component
                            )}
                        </div>

                        <div className="generatedCode">
                            <h1>Or enter this code instead</h1>
                            <div className="copy-code">
                                <div className="codeValue">{secret}</div>
                                <div className="icon" onClick={copyCodeToClipboard}>
                                    <span title="Copy">
                                        <img src={copyIcon} alt="Copy Icon" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="activateAuthCode col-span-2">
                            <div className="activateAuthCode grid">
                                <h1>Verification code</h1>
                                <div className="inputsAContainer">
                                    {inputs.map((value, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            maxLength="1"
                                            value={value}
                                            onChange={(e) => handleInputChange(index, e)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onKeyPress={(e) => {
                                                // Only allow numbers (key codes 48-57)
                                                const charCode = e.which ? e.which : e.keyCode;
                                                if (charCode < 48 || charCode > 57) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="inputsA"
                                        />
                                    ))}
                                </div>
                                    <div><button className='avtivatebtn' onClick={handleActivate}>Activate</button></div>
                            </div>
                        </div>
                    </div>
                    <div className="closebtn">
                        <button onClick={onClose}>X</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TwoFactorAuthentication;