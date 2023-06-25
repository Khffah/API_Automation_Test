const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require ("chai").expect;
var userId;

before (function (done){
    request.post('/authentications')
            .send({
                "email": "jaya@mail.com",
                "password": "1234"
            })
            .end(function(err,response){
                token = response.body.data.accessToken
                if(err){
                    throw err
                }
                done()
            })
})

describe("Authorization - Registration", function(){
    //positive case
    it("(+)Memasukkan nama, email (dengan format yang valid yaitu mengandung @ dan .) dan password",
    async function(){
        const response = await request
                        .post("/registration")
                        .send({
                            "name": "Merchant Ofi",
                            "email": "merchant@mail.com",
                            "password": "1234"
                        });
        expect(await response.statusCode).to.eql(201);
        expect(await response.body.status).to.eql("success");
        //console.log(response)
    })
    //negative case
    it("(-)Memasukkan nilai kosong pada email", async function (){
        const response = await request
                        .post("/registration")
                        .send({
                            "name": null,
                            "email": "merchant@mail.com",
                            "password": "1234"
                        });
        expect(await response.statusCode).to.eql(400);
        expect(await response.body.status).to.eql("fail");
        //console.log(response)
    })
})
describe("Authorization-Login", function(){
    //positive case
    it("(+)Memasukkan email (dengan format yang valid yaitu mengandung @ dan .) dan password",
    async function(){
        const response = await request
                        .post("/authentications")
                        .send({
                            "email": "merchant@mail.com",
                            "password": "1234"
                        });
        expect(await response.statusCode).to.eql(201);
        expect(await response.body.status).to.eql("success");
        //console.log(response)
        
    })
    //negative case
    it("(-)Memasukkan password yang salah", async function (){
        const response = await request
                        .post("/authentications")
                        .send({
                            "email": "merchant@mail.com",
                            "password": "123456"
                        });
                        
        expect(await response.statusCode).to.eql(401);
        expect(await response.body.status).to.eql("fail");
        //console.log(response)
    })
})

describe("User - Create User", function(){
    //positive case
    it("(+)Membuat akun baru", (done)=>{
        request.post("/users")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "name": "adminsby",
                    "email": "user@example.com",
                    "password": "admin123"
                })
                .end(function(err,response){
                    expect(response.statusCode).to.eql(201);
                    expect(response.body.status).to.eql("success");
                    console.log(response.body);
                    userId = response.body.data.userId;
                    if (err){
                        throw err
                    }
                    done()
                })
            
                //console.log(response)
    })
    //Negative case
    it("(-)Membuat akun baru dengan password kosong", (done)=>{
        request.post("/users")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "name": "adminjkt",
                    "email": "user@example.com",
                    "password": ""
                })
                .end(function(err,response){
                    expect(response.statusCode).to.eql(400);
                    expect(response.body.status).to.eql("fail");
                    if (err){
                        throw err
                    }
                    done()
                })
            
                //console.log(response)
    })
})
describe("User - Get User Detail", function (){
    //positive case
    it("(+)Memeriksa detail cutomer", (done)=>{
        request.get(`/users/${userId}`)
               .set('Authorization', `Bearer ${token}`)
                .end(function(err,response){
                    expect(response.statusCode).to.eql(200);
                    expect(response.body.status).to.eql("success");
                    // console(response.body)
                    if (err){
                        throw err
                    }
                    done()
                })
            })
    //negative case
    it("(-)user not found", (done)=>{
        request.get('/users/1234')
               .set('Authorization', `Bearer ${token}`)
               .end(function(err,response){
            expect(response.statusCode).to.eql(404);
            expect(response.body.status).to.eql("fail");
            // console(response.body)
            if (err){
                throw err
            }
            done()
    })
    })
})
