import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Document from 'App/Models/Document'



export default class DocumentsController {
    
    public async index({ view }: HttpContextContract){
        
        const documents = await Document.all()
        return view.render( 'documents/index', {documents: documents})
    }

    public async show({ view, params }: HttpContextContract){
        const document = await Document.find(params.id)
        return view.render('documents/show',{ document })
    }

    public store({ request, response }: HttpContextContract){
        const text = request.input('text')
        const document = {
            id: 1,
            text: text,
        }

        return response.json(document)
    }
}
