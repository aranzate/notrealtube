import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
    public async create({view}: HttpContextContract){
        return view.render('users/create')
    }

    public async store({auth, request, response}: HttpContextContract){
        const name = request.input('name')
        const email = request.input('email')
        const password = request.input('password')
        const confirmPassword = request.input('confirmPassword')

        if(password !== confirmPassword) {
            
            return response.redirect().toRoute('users/create')
        }

        try {
            const user = await User.create({email, password, name})
            await auth.use('web').login(user)
            return response.redirect().toRoute('home')
        } catch {
            return response.redirect().toRoute('users/create')
        }

        
    }

    public async edit ({view, auth}: HttpContextContract){
        const userName = auth.user?.name
        const userEmail = auth.user?.email        
        return view.render('users/edit', {userName: userName, userEmail: userEmail})
    }

    public async update ({auth, request, response}: HttpContextContract){        
        const name = request.input('name')
        const email = request.input('email')
        const password = request.input('password')
        const confirmPassword = request.input('confirmPassword')
        
        if(password !== confirmPassword){
            return response.redirect().toRoute('users/edit')
        }

        const userId = auth.user?.id
        
        try {
            const user = await User.findOrFail(userId)
            user.name = name
            user.email = email
            user.password = password

            await user.save()
            return response.redirect().toRoute('home')
        }
        catch {
            return response.redirect().toRoute('users/edit')
        }
    }

    public async home ({view}: HttpContextContract) {
        return view.render('home')
    }
}
