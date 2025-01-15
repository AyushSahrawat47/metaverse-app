const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000';

describe("Authentication", () => {
    test('User is able to sign up only once', async () => {
        const username = "Ayush" + Math.random();
        const password = "password";
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password,
            role: 'admin'
        })
        expect(response.status).toBe(200);
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password,
            role: 'admin'
        })
        expect(updatedResponse.status).toBe(400);
    });

    test('signup request failed if the username is empty', async () => {
        const password = "password"
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            password,
            role: 'admin'
        })
        expect(response.status).toBe(400);
    })

    test('signin succeeds with correct credentials', async () => {
        const username = "Ayush" + Math.random();
        const password = "password";
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password,
            role: 'admin'
        })
        expect(response.status).toBe(200);
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
            username,
            password
        })
        expect(updatedResponse.status).toBe(200);
        epxect(updatedResponse.body.token).toBeDefined();
    })

    test('signin fails with incorrect credentials', async () => {
        const username = "Ayush" + Math.random();
        const password = "password";
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password,
            role: 'admin'
        })
        expect(response.status).toBe(200);
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
            username,
            password: "wrongpassword"
        })
        expect(updatedResponse.status).toBe(403);
        const againUpdatedResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
            username: "wrongUsername",
            password
        })
        expect(againUpdatedResponse.status).toBe(403);
    })

    // test('signin fails with empty credentials', async()=>{
    //     const username = "Ayush"+Math.random();
    //     const password = "password";
    //     const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`,{
    //         username,
    //         password,
    //         role:'admin'
    //     })
    //     expect(response.status).toBe(200);
    //     const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`,{
    //         password
    //     })
    //     expect(updatedResponse.status).toBe(403);
    //     const againUpdatedResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`,{
    //         username
    //     })
    //     expect(againUpdatedResponse.status).toBe(403);
    // })

})

describe("User metadata endpoints", () => {
    let token = "";
    let avatarId = "";

    beforAll(async () => {
        const username = "Ayush" + Math.random();
        const password = "password";

        await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password,
            role: 'admin'
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
            username,
            password
        })
        token = response.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://yt3.googleusercontent.com/R1vlhyGLOoLp2Ygon20Xm960qKA3nY85fPUB7jRyyjaU3Wl6J2nQCNYrFm8dta1CeuLT-5tP=s900-c-k-c0x00ffffff-no-rj",
            "name": "avatar"
        })

        avatarId = avatarResponse.data.id;
    })

    test('User cant update their metdata with wrong avatar id', async () => {
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: 1213842
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status).toBe(400);
    })

    test('User is able to update their metadata with correct avatar id', async () => {
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status).toBe(200);
    })
    
    test('User is unable to update their metadata if auth header not present', async () => {
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        })
        expect(response.status).toBe(403);
    })
    
})

describe('User Avatar information',()=>{
    let token = "";
    let avatarId = "";
    let userId = "";

    beforAll(async () => {
        const username = "Ayush" + Math.random();
        const password = "password";

        const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
            username,
            password,
            role: 'admin'
        })

        userId = signUpResponse.data.userId;

        const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
            username,
            password
        })
        token = response.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://yt3.googleusercontent.com/R1vlhyGLOoLp2Ygon20Xm960qKA3nY85fPUB7jRyyjaU3Wl6J2nQCNYrFm8dta1CeuLT-5tP=s900-c-k-c0x00ffffff-no-rj",
            "name": "avatar"
        })

        avatarId = avatarResponse.data.id;
    })

    test('Get back avatar information for user', async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)
        expect(response.data.avatars.length).toBe(1);
        expect(response.status).toBe(200);
        // expect(response.data.avatars[0].userId).toBeDefined();
        expect(response.data.avatars[0].userId).toBe(userId);
    })

    test('Available avatars lists the recently created avatar', async()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0); 
    })

})