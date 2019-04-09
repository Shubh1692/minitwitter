import openSocket from 'socket.io-client';
export const API_DOMAIN = 'https://minitwitterapp-demo.herokuapp.com/';
export const socket = (token) => {
    return openSocket(API_DOMAIN, {
        'query': `token=${token}`
    })
};