// // import React, { useState } from 'react';
// // import axios from 'axios';
// // // Define dummy util.deprecate function for browser compatibility
// // if (typeof util === 'undefined') {
// //     var util = {};
// // }

// // if (typeof util.deprecate !== 'function') {
// //     util.deprecate = function() {};
// // }
// // import speakeasy from 'speakeasy';
// // import QRCode from 'qrcode.react';

// const TwoFactorAuth = () => {
//     // const [secret, setSecret] = useState('');
//     // const [token, setToken] = useState('');
//     // const [verificationResult, setVerificationResult] = useState('');

//     // const generateQRCode = () => {
//     //     const generatedSecret = speakeasy.generateSecret({ length: 20 });
//     //     const qrCodeUrl = `otpauth://totp/YourAppName?secret=${generatedSecret.base32}&issuer=YourAppName`;
//     //     setSecret(generatedSecret.base32);
//     //     return qrCodeUrl;
//     // };

//     // const verifyToken = () => {
//     //     const verified = speakeasy.totp.verify({
//     //         secret: secret,
//     //         encoding: 'base32',
//     //         token: token,
//     //         window: 1
//     //     });

//     //     if (verified) {
//     //         setVerificationResult('Token is valid');
//     //     } else {
//     //         setVerificationResult('Token is invalid');
//     //     }
//     // };

//     return (
//         <div>
//             {/* <QRCode value={generateQRCode()} />
//             <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter token" />
//             <button onClick={verifyToken}>Verify Token</button>
//             {verificationResult && <p>{verificationResult}</p>} */}
//         </div>
//     );
// };

// export default TwoFactorAuth;
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import React, { useState } from "react";

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [CloudImage, SetCloudImage] = useState(null);
    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }
    });

    const uploadImage = async () => {
        setLoading(true);
        const data = new FormData();
        data.append("file", image);
        data.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        data.append("folder", "Cloudinary-React");

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            );
            const res = await response.json();
            setUrl(res.public_id);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            setPreview(reader.result);
        };
    };

    const handleResetClick = () => {
        setPreview(null);
        setImage(null);
    };

    console.log(url);
    return (
        <div className="h-screen sm:px-8 md:px-16 sm:py-8">
            <div className="container mx-auto max-w-screen-lg h-full">
                <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                    <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                        <span>Click on Upload a File</span>&nbsp;
                    </p>
                    <input
                        id="hidden-input"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <label htmlFor="hidden-input" className="cursor-pointer">
                        <div className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                            Upload a file
                        </div>
                    </label>

                    <div className="flex justify-center items-center mt-5 mx-3 max-w-xs">
                        {preview && <img src={preview} alt="preview" className="w-full" />}
                    </div>
                </header>
                <div className="flex justify-end pb-8 pt-6 gap-4">
                    <button
                        onClick={uploadImage}
                        className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none disabled:cursor-not-allowed"
                        disabled={!image}
                    >
                        Upload now
                    </button>
                    <button
                        onClick={handleResetClick}
                        className="rounded-sm px-3 py-1 bg-red-700 hover:bg-red-500 text-white focus:shadow-outline focus:outline-none"
                    >
                        Reset
                    </button>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-6 w-6"></div>
                        <span>Processing...</span>
                    </div>
                ) : (
                    url && (
                        <div className="pb-8 pt-4">
                            <AdvancedImage cldImg={cld.image(url)} />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ImageUpload;