module.exports = class AccountsHandler{

    usernameToAccount;

    constructor() {
        this.usernameToAccount = new Map();
    }

    addUser(user){
        this.usernameToAccount.set(user.username, user)
        console.log('AccountsHandler added user', user)
        return user
    }

    removeUser(username){
        console.log('AccountsHandler removed user', username)
        return this.usernameToAccount.delete(username)
    }

    getUserByUsername(username){
        return this.usernameToAccount.get(username)
    }

}