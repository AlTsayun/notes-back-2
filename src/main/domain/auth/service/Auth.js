const jwt = require('jsonwebtoken')

module.exports = class Auth{
    secretkey = "secretkey"

    verifyTokenMiddleware(req, res, next){
        const bearerHeader = req.header('authorization')
        // console.log(req.header('authorization'))

        if (bearerHeader !== undefined){
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]

            console.log(bearerToken)
            jwt.verify(bearerToken, this.secretkey, (err, authData)=> {
                if (err){
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

    sign(credentials, tokenHandler){
        jwt.sign(credentials, this.secretkey, tokenHandler)
    }
}