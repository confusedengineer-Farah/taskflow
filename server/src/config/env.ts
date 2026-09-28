import "dotenv/config";

function requirde(name: string) : string {
    const value = process.env[name];
    if(!value){
        throw new Error("Missing environment variable: "+ name);
    }
    return value;
}

export const env = {
    port: Number(process.env.PORT) || 5000,
    jwtSecret: requirde("JWT_SECRET"),
    clientUrl: requirde("CLIENT_URL"),
};