import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SessionsController {

    public async create({ view }: HttpContextContract){
        return view.render('sessions/create')
    }

    public async store({ auth, request, response, session}: HttpContextContract){
        response.clearCookie('viewedVideos')
        const loginSchema = schema.create({
            email: schema.string([
                rules.email(),
            ]),
            password: schema.string([
                rules.escape(),
                rules.minLength(6),
                rules.maxLength(20)
            ]),
        })

        try{
            const { email, password } = await request.validate({
                schema: loginSchema,
              })
            await auth.use('web').attempt(email, password)
            response.redirect().toRoute('home')
        
        } catch{
            session.flash('notification', 'Dados incorretos!')

            return response.redirect().toRoute('sessions/create')
        }
    }

    public async delete({ auth, response }: HttpContextContract){
        response.clearCookie('viewedVideos')
        await auth.use('web').logout()
        return response.redirect().toRoute('home')
    }

}
