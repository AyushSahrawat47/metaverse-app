const axios = require( 'axios');

const   BACKEND_URL = 'http://localhost:3000',

describe("Authentication", () => {
    test('User is able to sign up only once', ()=>{
        const username = "Ayush"+Math.random();
        const password = "password";
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`,{
            username,
            password,
            role:'admin'
        })
        expect(response.statusCode).toBe(200);
        const updatedResponse = 
    })
})