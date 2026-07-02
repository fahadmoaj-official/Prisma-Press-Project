import app from "./app";
import env from './config/env';
import { prisma } from "./lib/prisma";

const PORT = env.PORT;

async function main() {
    try{
        await prisma.$connect();
        console.log("Connected to database successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(err){
        console.error("Error while starting server:", err);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();