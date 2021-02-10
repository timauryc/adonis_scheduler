'use strict'

const User = use('App/Models/User') // user model
const Mail = use('Mail') // Adonis' mail

const moment = require('moment')
const crypto = require('crypto') // crypto

class ForgotPasswordController {
    async store({ request }) {
        try {
            // account request password recovery
            const { email } = request.only(['email'])

            // checking if email is registered
            const user = await User.findByOrFail('email', email)

            // generating token
            const token = await crypto.randomBytes(10).toString('hex')

            // registering when token was created and saving token
            user.token_created_at = new Date()
            user.token = token

            // persisting data (saving)
            await user.save()

            await Mail.send('emails.recover', { user, token }, (message) => {
                message
                    .from('support@danmiranda.io')
                    .to(email)
            })

            return user
        } catch (err) {
            console.log(err)
        }
    }
    
    async update({ request, response, params }) {
        const tokenProvided = params.token // retrieving token in URL
        const emailRequesting = params.email // email requesting recovery
        
        const { newPassword } = request.only(['newPassword'])
        
        // looking for user with the registered email
        const user = await User.findByOrFail('email', emailRequesting)
        
        // checking if token is still the same
        // just to make sure that the user is not using an old link
        // after requesting the password recovery again
        const sameToken = tokenProvided === user.token
        
        if (!sameToken) {
            return response
            .status(401)
            .send({
                message: {
                    error: 'Old token provided or token already used'
                }
            })
        }
        
        // checking if token is still valid (48 hour period)
        const tokenExpired = moment()
        .subtract(2, 'days')
        .isAfter(user.token_created_at)
        
        if (tokenExpired) {
            return response.status(401).send({ message: { error: 'Token expired' } })
        }
        
        // saving new password
        user.password = newPassword
        
        // deleting current token
        user.token = null
        //user.token_created_at = 0

        // persisting data (saving)
        await user.save()
    }

}
module.exports = ForgotPasswordController
