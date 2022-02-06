const mongoose = require('mongoose')
const { render } = require('../app')
const User = require('../models/User.model')

module.exports.signup = (req, res, next) => {
    res.render('auth/signup')
}

module.exports.doSignup = (req, res, next) => {
    const user = { username, password } = req.body

    const renderWithErrors = (errors) => {
        res.render('auth/signup', {
            errors: errors,
            user: user
        })
    }
    
    User.findOne({ username: username })
        .then((userFound) => {
            if (userFound) {
                renderWithErrors({ username: 'This user name is not available.'})
            } else {
                return User.create(user)
                    .then(() => res.redirect('/'))
            }
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                renderWithErrors(error.errors)
            } else {
                next(error)
            }
        }) 
}

module.exports.login = (req, res, next) => {
    res.render('auth/login')
}

module.exports.doLogin =  (req, res, next) => {
    const { username, password } = req.body

    const renderWithErrors = () => {
        res.render('auth/login', {
            errors: { username: 'Invalid username or password!'},
            user: req.body
        })
    }

    User.findOne({ username: username })
        .then((userFound) => {
            if(!userFound) {
                renderWithErrors()
            } else {
                return userFound.checkPassword(password)
                    .then(match => {
                        if(!match) {
                            renderWithErrors()
                        } else {
                            req.session.userId = userFound.id
                            res.redirect('/profile')
                        }
                    })
            } 
        })
        .catch(error => next(error))
}