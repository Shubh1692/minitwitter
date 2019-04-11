import openSocket from 'socket.io-client';
export const API_DOMAIN = 'https://minitwitterapp-demo.herokuapp.com/';
 /**
 * @name socket
 * @description
 * This method used connect socket
 * @param token loggend in user auth token
*/
export const socket = (token) => {
    return openSocket(API_DOMAIN, {
        'query': `token=${token}`
    })
};