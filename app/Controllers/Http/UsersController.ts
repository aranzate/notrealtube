import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class UsersController {
    public async create({view}: HttpContextContract){
        return view.render('users/create')
    }

    public async store({auth, request, response, session}: HttpContextContract){
        
        const registeringSchema = schema.create({
            name: schema.string(),
            email: schema.string([
                rules.unique({ table: 'users', column: 'email' }),
                rules.email(),
            ]),
            password: schema.string([
                rules.escape(),
                rules.confirmed(),
                rules.minLength(6),
                rules.maxLength(20)
            ]),
        })


        try {
            const { email, name, password } = await request.validate({
                schema: registeringSchema,
              })

            const user = await User.create({ email, password, name })
            await auth.use('web').login(user)
            return response.redirect().toRoute('home')
        } catch (error) {
            session.flash('errors', error.messages)
            return response.redirect().back()
          }
        
    }

    public async edit ({view, auth}: HttpContextContract){
        const userName = auth.user?.name
        const userEmail = auth.user?.email        
        return view.render('users/edit', {userName: userName, userEmail: userEmail})
    }

    public async update ({auth, request, response, session}: HttpContextContract){        
        const editSchema = schema.create({
            name: schema.string(),
            email: schema.string([
                rules.email(),
            ]),
            password: schema.string([
                rules.escape(),
                rules.confirmed(),
                rules.minLength(6),
                rules.maxLength(20)
            ]),
        })

        const userId = auth.user?.id
        
        try {
            const { email, name, password } = await request.validate({
                schema: editSchema,
              })
            const user = await User.findOrFail(userId)
            user.name = name
            user.email = email
            user.password = password

            await user.save()
            return response.redirect().toRoute('home')
        }
        catch(error) {
            session.flash('errors', error.messages)
            return response.redirect().back()

        }
    }

    public async home ({view}: HttpContextContract) {
        return view.render('home')
    }
}
