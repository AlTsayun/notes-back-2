const jsonwebtoken = require('jsonwebtoken')
// const ejwt = require('express-jwt');

module.exports = class Auth{

    constructor(secretKey){
        this.secretKey = secretKey
    }

    

    verifyTokenInHeader(req, res, next){
        const bearerHeader = req.header('authorization')
        // console.log(req.header('authorization'))

        if (bearerHeader !== undefined){
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]

            console.log(bearerToken)
            jsonwebtoken.verify(bearerToken, this.secretKey, (err, authData)=> {
                if (err){
                    console.log('Token not verified')
                    res.sendStatus(403)
                } else {
                    console.log('Token verified')
                    next()
                }
            })
        } else {
            res.sendStatus(403)
        }
    }

    verifyTokenInCookie(req, res, next){
        console.log(this)
        console.log('recieved cookies', req.cookies)
        jsonwebtoken.verify(req.cookies.token, this.secretKey, (err, authData)=> {
            if (err){
                console.log('Token not verified')
                res.sendStatus(403)
            } else {
                console.log('Token verified')
                next()
            }
        })
    }


    sign(credentials, tokenHandler){
        jsonwebtoken.sign(credentials, this.secretKey, tokenHandler)
    }
}