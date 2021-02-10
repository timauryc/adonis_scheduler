'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UpdateUserInfoController {
    async update({ request, response, params }) {
        const id = params.id
        const { username, password, newPassword } = request
            .only(['username', 'password', 'newPassword'])

        // looking for user in DB
        const user = await User.findByOrFail('id', id)

        // checking if old password informed is correct
        const passwordCheck = await Hash.verify(password, user.password)

        if (!passwordCheck) {
            return response
                .status(400)
                .send({ message: { error: 'Incorrect password provided' } })
        }

        // updating user data
        user.username = username
        user.password = newPassword

        // persisting new data (saving)
        await user.save()
    }
}

module.exports = UpdateUserInfoController
