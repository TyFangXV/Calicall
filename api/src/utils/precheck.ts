/*
 make sure all the backend services are available
*/

import database from './database';


export default async function precheck() {
    try {
        await database.$connect();
        await database.$disconnect();
        return {
            status: true,
            message: 'All services are available'
        }
    } catch (error:any) {
        return {
            status: false,
            message: error.message
        }
    }
}