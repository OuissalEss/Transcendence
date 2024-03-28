"use client"
import { useRef, useState } from "react";
import lockIcon from "/Icons/Lock2.png"

import Cookies from "js-cookie";

import '../assets/twofactorauth.css'
import { useAuth } from "../provider/authProvider.tsx";


export default function TwoFactorAuth() {


    const [inputs, setInputs] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
    const { token } = useAuth();
    const handleInputChange = (index, e) => {
        const { value } = e.target;
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);

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


    const handleVerify = () => {
        // Send POST request to backend endpoint with bearer token in the Authorization header
        fetch("http://localhost:3000/2fa/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include bearer token in Authorization header
            },
            body: JSON.stringify({ code: inputs.join('') }),
        })
            .then(async response => {
                if (response.ok) {
                    setIsVerificationSuccess(true);
                    const { accessToken } = await response.json();
                    Cookies.set('token', accessToken.access_token)
                    // Reload the page upon successful verification
                    window.location.reload();
                } else {
                    setIsVerificationSuccess(false);
                    alert("Failed to verify 2FA code");
                    setInputs(['', '', '', '', '', '']);
                    console.error("Failed to verify 2FA code");
                }
            })
            .catch(error => {
                console.error("Error verifying 2FA code:", error);
            });
    };



    return (
        <section className="tfa">
            <h1>Two Factor Authentication</h1>
            <div className="tfaPage">
                <div className="flex tfaContainer">
                    <div className="verify">
                        {/* <h1>Verification Code</h1> */}
                        <img src={lockIcon} />
                        <div className="code">
                            {inputs.map((value, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
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
                                    className="inputs"
                                />
                            ))}
                        </div>
                        <div className="verifyBtn"><button onClick={handleVerify}><span>Verify</span></button></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
