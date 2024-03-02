interface JwtConstants {
    secret: string;
    expiresIn: string;
}

export const jwtConstants: JwtConstants = {
    secret: '80c699458ac38e51d2ebf9d290c1c58b12616fad5b96157805268e7e3f9a4f42b1758185d3534a7698e5439c07ce7fc3d2edc17659447eb0f0376223a7cec20b',
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",  
};