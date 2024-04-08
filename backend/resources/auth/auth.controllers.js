const fs = require('fs').promises
const bcrypt = require('bcrypt')
const fetchUsers = require('../../utils/fetchUsers')

const login = async (req, res) => {
    const {email, password} = req.body

    const users = await fetchUsers()
    const userExists = users.find(u => u.email === email)

    //kolla att lösenordet stämmer, att användaren finns
    if(!userExists || !await bcrypt.compare(password, userExists.password)) {
        return res.status(400).json('Wrong user or password')
    }

    //skapa session
    req.session.user = userExists

    //skicka tillbaka ett svar
    res.status(200).json(userExists.email)
}
const logout = (req, res) => {
    req.session = null
    res.status(200).json('Succesfully logged out')
}

const authorize = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json('You are not logged in')
    }
    res.status(200).json(req.session.user.email)
}

module.exports = { login, logout, authorize }