
const request = require("supertest");

// Replace "htttp" with "http" in BACKEND_URL
const BACKEND_URL = "http://localhost:4000";

describe("Authentication", () => {
  test("User is able to sign up only once", async () => {
    const username = "testuser@exampldfhgdfe.com";
    const password = "123456fgdfg";

    // First signup attempt
    const response = await request(BACKEND_URL)
      .post("/api/v1/signup")
      .send({ username, password, type: "admin" });
    expect(response.status).toBe(201);

    // Duplicate signup attempt
    const duplicateResponse = await request(BACKEND_URL)
      .post("/api/v1/signup")
      .send({ username, password, type: "admin" });
    expect(duplicateResponse.status).toBe(400);
  });

  test("Signup request fails if username is empty", async () => {
    const password = "123456";

    const response = await request(BACKEND_URL)
      .post("/api/v1/signup")
      .send({ password }); // No username provided
    expect(response.status).toBe(400);
  });

  test("Signin is successful if the username and password are correct", async () => {
    const username = "testuser@exggghgplesfsfsd.com";
    const password = "123456234234";

    // Signup first
    const signupResponse = await request(BACKEND_URL)
      .post("/api/v1/signup")
      .send({ username, password });
    expect(signupResponse.status).toBe(201);

    // Attempt signin
    const signinResponse = await request(BACKEND_URL)
      .post("/api/v1/signin")
      .send({ username, password });
    expect(signinResponse.status).toBe(200);
    expect(signinResponse.body.token).toBeDefined();
  });

  test("Signin fails if the username and password are incorrect", async () => {
    const username = "testuser@example.com";
    const password = "123456";

    // Signup first
    await request(BACKEND_URL)
      .post("/api/v1/signup")
      .send({ username, password });

    // Attempt signin with incorrect username
    const signinResponse = await request(BACKEND_URL)
      .post("/api/v1/signin")
      .send({ username: "wrongusername@example.com", password });
    expect(signinResponse.status).toBe(404);
  });
});

const axios2 = require("axios");

  const BACKEND_URL = "htttp://localhost:4000"
//  const WS_URL = "http://localhost:3001"

 const axios = {
    post:async(...args)=>{
        try{
            const res = await axios2.post(...args)
            return res
        }
        catch(err){
            return err.response
        }
    },
    get:async(...args)=>{
        try{
            const res = await axios2.get(...args)
            return res
        }
        catch(err){
            return err.response
        }
    },
    put:async(...args)=>{
        try{
            const res = await axios2.put(...args)
            return res
        }
        catch(err){
            return err.response
        }
    },
    delete:async(...args)=>{
        try{
            const res = await axios2.delete(...args)
            return res
        }
        catch(err){
            return err.response
        }
    },
 }
 describe("Authentication", () => {
    test("User is able to sign up only once", async () => {
        const username = "testuser@example.com";
        const password = "123456fgdfg";

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "admin",
            });
            expect(response.status).toBe(201);

            const duplicateResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                type: "admin",
            });
            expect(duplicateResponse.status).toBe(400);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            throw error;
        }
    });

    test("Signup request fails if username is empty", async () => {
        const password = "123456";
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                password,
            });
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            expect(error.response.status).toBe(400);
        }
    });

    test("Signin is successful if the username and password are correct", async () => {
        const username = "testuser@example.com";
        const password = "123456";
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
            });

            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password,
            });
            expect(response.status).toBe(200);
            expect(response.data.token).toBeDefined();
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            throw error;
        }
    });

    test("Signin fails if the username and password are incorrect", async () => {
        const username = "testuser@example.com";
        const password = "123456";
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
            });

            await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username: "wrongusername@example.com",
                password,
            });
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            expect(error.response.status).toBe(403);
        }
    });
});


 describe("User informastion endpoints",async()=>{
    let token ; // so that i can use this global varibale to all the test because all the tests are authenticated 
    let avatarId;// so thaat i can use this global variable to all test case
    beforeAll(async()=>{
        const username = "Anand"
        const password = "123456"
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })
        const response =  await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        token = response.data.token
        //create an avatar so that i can test it
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        },{
            headers:{
                "authorization":`Bearer${token}`
            }
        })
        avatarId = avatarResponse.data.avatarId

    })
    test("User can't update their metadata with a wrong avatar id",async()=>{
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId:"1212121232"
        },{
            headers:{
                "authorization":`Bearer${token}`
            }
        })
        expect(response.statusCode).toBe(400)
    })
    test("user can update their metadata with a right avatar id",async()=>{
        //before that we haave to create a new avatar
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId:avatarId
        },{
            headers:{
                "authorization":`Bearer${token}`
            }
        })
        expect(response.statusCode).toBe(200)
         
    })
    test("user is not able to update their metadata if the auth header is not present",async()=>{
        const response = await axios.put(`${BACKEND_URL}/api/v1/metadata`,{
            avatarId:avatarId
        })
        expect(response.statusCode).toBe(403)
    })
 })

 describe("user avatar information", async()=>{
    let token ; // so that i can use this global varibale to all the test because all the tests are authenticated 
    let avatarId;
    let userId;

    beforeAll(async()=>{
        const username = "Anand"
        const password = "123456"
         const signupResponse = await axios .post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })
        userId = signupResponse.data.userId;
        const response =await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
       
        token = response.data.token
        //create an avatar so that i can test it
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        },{
            headers:{
                authorization:`Bearer${token}`
            }
        })
        avatarId = response.data.avatarId

    })
    test("Get back avatar information for a user",async()=>{
        const response= axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)
        expect(response.data.avatars.length).toBe(1)
    })
    test ("Available avatars lists the recently created avatars" ,async()=>{
        const response =await axios.post(`${BACKEND_URL} /api/v1/avatars`)
        expect(response.data.avatars.length).not.toBe(0)
        const currentAvatar = response.data.avatars(x=>x.id==avatarId)
        expect (currentAvatar).toDefined()
    })
 })

 describe("Space information",()=>{
  
    let element1Id;
    let element2Id;
    let userId;
    let userToken
    let adminId
    let adminToken;
    let mapId;

    beforeAll(async()=>{
        const username = "Anand"
        const password = "123456"
        const userSignupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username: username+"-user",
            password,
            type:"user"
        })
        userId= userSignupResponse.data.userId;
       
        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username: username+"-user",
            password
        })
        userToken = userSigninResponse.data.token
        
        const signupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:"admin"
        })
        adminId= signupResponse.data.userId;
        
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        adminToken = response.data.token
        
        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
              "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
            },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
            }
        )
        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
              "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
            },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
            }
        )
        element1Id = element1.data.id,
        element2Id = element2.data.id
        const map = await axios.post(`${BACKEND_URL}/api.v1/admin/map`,
            {
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: element1Id,
                        x: 20,
                        y: 20
                    }, {
                      elementId: element1Id,
                        x: 18,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }
                ]
             },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
             })
        mapId=map.data.id
    })
      test("User is able to create a space",async()=>{
      const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
             "name": "Test",
             "dimensions": "100x200",
             "mapId": "map1"
       },{
        headers:{
            authorization:`Bearer${userToken}`
        }})
       expect(response.data.spaceId).toBeDefined();

      })
      test("User is not able to create a space without mapId",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
               "name": "Test",
               "dimensions": "100x200",    
         },{
            headers:{
                authorization:`Bearer${userToken}`
            }})
         expect(response.statusCode).toBe(400);
  
      })
      test("User is not able to create a space without dimension",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
               "name": "Test",
               "mapId": "map1"
         },{
            headers:{
                authorization:`Bearer${userToken}`
            }})
         expect(response.statusCode).toBe(400);
      })
      test("user is not able to delete space that does not exist",async()=>{
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesnotWxist`)
        expect(response.statusCode).toBe(400)
      },{
        headers:{
            authorization:`Bearer${userToken}`
      }})
      test("user is able to delete the space that does exist",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
            "dimensions": "100x200",
            "mapId": "map1"
      },{
        headers:{
            authorization:`Bearer${userToken}`
        }})
      const deleteResponse = await axios.delete(`${BACKEND_URL}api/v1/space/${response.data.spaceId}`,{
        headers:{
            authorization:`Bearer${userToken}`
        }})
      expect(deleteResponse.statusCode).toBe(200)
      })
      test("user is not able to delete to someone else space",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
            "dimensions": "100x200",
            "mapId": "map1"
      },{
        headers:{
            authorization:`Bearer${userToken}`
        }})
        const deleteResponse = await axios.delete(`${BACKEND_URL}api/v1/space/${response.data.spaceId}`,{
            headers:{
                authorization:`Bearer${adminToken}`//try to delete someone elses space with admin token 
            }})
          expect(deleteResponse.statusCode).toBe(400)
      })

 })

 describe("arena endpoints",()=>{
  
    let element1Id;
    let element2Id;
    let userId;
    let userToken
    let adminId
    let adminToken;
    let mapId;
    let spaceId

    beforeAll(async()=>{
        const username = "Anand"
        const password = "123456"
        const userSignupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username+"-user",
            password,
            type:"user"
        })
        userId= userSignupResponse.data.userId;
       
        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username+"-user",
            password
        })
        userToken = userSigninResponse.data.token
        
        const signupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username: username,
            password,
            type:"admin"
        })
        adminId= signupResponse.data.userId;
        
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
             username: username+"-user",
            password
        })
        adminToken = response.data.token
        
        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
              "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
            },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
            }
        )
        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
              "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
            },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
            }
        )
        element1Id = element1.data.id,
        element2Id = element2.data.id
        const map = await axios.post(`${BACKEND_URL}/api.v1/admin/map`,
            {
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: element1Id,
                        x: 20,
                        y: 20
                    }, {
                      elementId: element1Id,
                        x: 18,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }
                ]
             },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
             })
        mapId=map.data.id
        const space = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
           },{
            headers:{
                "authorization" :`Bearer${userToken}`
            }})
            spaceId=space.data.spaceId
            
       
    })
      test("Incorrect spaceid returns a 400",async()=>{
       const response= await axios.get(`${BACKEND_URL}/api/v1/space/1244zcvxv`,{
        headers:{
            "authorization":`Bearer${userToken}`
        }
       })
        expect(response.statusCode).toBe(400)
      })
      test("Correct spaceid returns all the elements",async()=>{
        const response=await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                "authorization":`Bearer${userToken}`
            }
           })
         expect(response.data.dimensions).toBe("100x200")
         expect(response.data.elements.length).toBe(4);
       })
       test("Delete endpoints is able to delete an element",async()=>{
        const response=await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                "authorization":`Bearer${userToken}`
            }
           })
        await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
            spaceId:spaceId,
            elementId:response.data.elements[0].id
        },{
            headers:{
                "authorization":`Bearer${userToken}`
            }
           })
        const newRespose= await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                "authorization":`Bearer${userToken}`
            }
           })
         expect(response.data.elements.length).toBe(3);
       })
       
       test("Adding an element works as expected",async()=>{
        await axios.post(`${BACKEND_URL}/api/v1/space/element`,
            {
                "elementId": "chair1",
                "spaceId": "123",
                "x": 50,
                "y": 20
              },{
                headers:{
                    "authorization":`Bearer${userToken}`
                }
               }
        )
        const newRespose= await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
         expect(response.data.elements.length).toBe(4);
       })
       test("Adding an element fails if the element lies outside the dimesnions",async()=>{
        const response= await axios.post(`${BACKEND_URL}/api/v1/space/element`,
            {
                "elementId": "chair1",
                "spaceId": "123",
                "x": 100000,
                "y": 34343434
              },{
                headers:{
                    "authorization":`Bearer${userToken}`
                }
               }
        )
         expect(response.statusCode).toBe(404);
       })


 })

 describe("Admin endpoints",()=>{
    let userId;
    let userToken
    let adminId
    let adminToken;

    beforeAll(async()=>{
        const username = "Anand"
        const password = "123456"
        const userSignupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username+"-user",
            password,
            type:"user"
        })
        userId= userSignupResponse.data.userId;
       
        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username+"-user",
            password
        })
        userToken = userSigninResponse.data.token
        
        const signupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username: username,
            password,
            type:"admin"
        })
        adminId= signupResponse.data.userId;
        
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
             username: username+"-user",
            password
        })
        adminToken = response.data.token       
    })
    test("user is not able to hit admin endpoints",async()=>{
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
              "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
            },{
                headers:{
                    authorization:`Bearer${userToken}`
                }
            }
        )
        expect(elementResponse.statusCode).toBe(404)
        const mapResponse = await axios.post(`${BACKEND_URL}/api.v1/admin/map`,
            {
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: element1Id,
                        x: 20,
                        y: 20
                    }, {
                      elementId: element1Id,
                        x: 18,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }
                ]
             },{
                headers:{
                    authorization:`Bearer${userToken}`
                }
             })
             expect(mapResponse.statusCode).toBe(404)

             const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
                "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
                "name": "Timmy"
            },{
                headers:{
                    authorization:`Bearer${userToken}`
                }
            })
            expect(avatarResponse.statusCode).toBe(404)

            const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/:123}`,{
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	
            },{
                headers:{
                    authorization:`Bearer${userToken}`
                }
            })
            expect(updateElementResponse.statusCode).toBe(404)
           
    })
    test("Admin is able to hit admin endpoints",async()=>{
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
              "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
            },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
            }
        )
        expect(elementResponse.statusCode).toBe(200)
        const mapResponse = await axios.post(`${BACKEND_URL}/api.v1/admin/map`,
            {
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: element1Id,
                        x: 20,
                        y: 20
                    }, {
                      elementId: element1Id,
                        x: 18,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }, {
                      elementId: element2Id,
                        x: 19,
                        y: 20
                    }
                ]
             },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
             })
             expect(mapResponse.statusCode).toBe(200)

             const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
                "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
                "name": "Timmy"
            },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
            })
            expect(avatarResponse.statusCode).toBe(200)

            
           
    })
    test("admin is able to update the imageUrl for an element",async()=>{
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
            {
                "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                "width": 1,
                "height": 1,
              "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
            },{
                headers:{
                    authorization:`Bearer${adminToken}`
                }
            }
        )

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}}`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	
        },{
            headers:{
                authorization:`Bearer${adminToken}`
            }
        })
        expect(updateElementResponse.statusCode).toBe(200)
    })

 })

//  describe("Websocket tests",()=>{
//     let element1Id;
//     let element2Id;
//     let userId;
//     let userToken
//     let adminId
//     let adminToken;
//     let mapId;
//     let spaceId;
//     let ws1;
//     let ws2;
//     let ws1Message=[]
//     let ws2Message=[]
    
//    async function setupHtttp(){
//         const username = "Anand"
//         const password = "123456"
//         const userSignupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username:username+"-user",
//             password,
//             type:"user"
//         })
//         userId= userSignupResponse.data.userId;
       
//         const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//             username:username+"-user",
//             password
//         })
//         userToken = userSigninResponse.data.token
        
//         const signupResponse =  await axios.post(`${BACKEND_URL}/api/v1/signup`,{
//             username: username,
//             password,
//             type:"admin"
//         })
//         adminId= signupResponse.data.userId;
        
//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
//              username: username+"-user",
//             password
//         })
//         adminToken = response.data.token
        
//         const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
//             {
//                 "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//                 "width": 1,
//                 "height": 1,
//               "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
//             },{
//                 headers:{
//                     authorization:`Bearer${adminToken}`
//                 }
//             }
//         )
//         const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`,
//             {
//                 "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//                 "width": 1,
//                 "height": 1,
//               "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
//             },{
//                 headers:{
//                     authorization:`Bearer${adminToken}`
//                 }
//             }
//         )
//         element1Id = element1.data.id,
//         element2Id = element2.data.id
//         const map = await axios.post(`${BACKEND_URL}/api.v1/admin/map`,
//             {
//                 "thumbnail": "https://thumbnail.com/a.png",
//                 "dimensions": "100x200",
//                 "name": "100 person interview room",
//                 "defaultElements": [{
//                         elementId: element1Id,
//                         x: 20,
//                         y: 20
//                     }, {
//                       elementId: element1Id,
//                         x: 18,
//                         y: 20
//                     }, {
//                       elementId: element2Id,
//                         x: 19,
//                         y: 20
//                     }, {
//                       elementId: element2Id,
//                         x: 19,
//                         y: 20
//                     }
//                 ]
//              },{
//                 headers:{
//                     authorization:`Bearer${adminToken}`
//                 }
//              })
//         mapId=map.data.id
//         const space = await axios.post(`${BACKEND_URL}/api/v1/space`,{
//             "name": "Test",
//             "dimensions": "100x200",
//             "mapId": mapId
//            },{
//             headers:{
//                 "authorization" :`Bearer${userToken}`
//             }})
//             spaceId=space.data.spaceId
            
       
//     }
//    async function setupWs(){
//         ws1= new WebSocket(WS_URL)
//         ws2 = new WebSocket(WS_URL)
//         await new Promise(r=>{
//             ws1.onopen=r // we are resolving promise only when ws connection open 
//         })
//         await new Promise(r=>{
//             ws2.onopen=r  //// we are resolving promise only when ws connection open 
//         })
//         //now we are ws connection to the open


//     }
// })  


// /we will write the ws tests after writing the ws servers