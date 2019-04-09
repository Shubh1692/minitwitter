import openSocket from 'socket.io-client';
export const API_DOMAIN = 'http://localhost:8000/';
export const socket = (token) => {
    return openSocket(API_DOMAIN, {
        'query': `token=${token}`
    })
};