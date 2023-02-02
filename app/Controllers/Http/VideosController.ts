
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'

export default class VideosController {
    public async list({view}: HttpContextContract) {
        const videos = await Video.all()
        return view.render('videos/list', {videos: videos})
    }

    public async show({ params, view, response }: HttpContextContract) {
        try {
            const video = await Video.findOrFail(params.id)
            const videoLink = 'https://www.youtube.com/embed/' + video.link.substring(32, 90)
            const videoName = video.name
            const videoDescription = video.description
            return view.render('videos/show', { videoName: videoName, videoLink: videoLink, videoDescription: videoDescription, videoId: params.id })
        } catch {
            return response.redirect().toRoute('videos/list')
        }
        
    }

    public async create({view}: HttpContextContract) {
        return view.render('videos/upload')
    }

    public async store({request, response}: HttpContextContract) {
        const video = await Video.create({
            name: request.input('name'), 
            description: request.input('description'), 
            link: request.input('link')
        })

        return response.redirect().toRoute('videos/show', {id: video.id})
    }

    public async edit({view, params}: HttpContextContract) {
        const videoId = params.id
        const video = await Video.findOrFail(videoId)
        const videoName = video.name
        const videoDescription = video.description
        return view.render('videos/edit', {videoId: videoId, videoName: videoName, videoDescription: videoDescription})
    }

    public async update({request, response, params}: HttpContextContract) {
        try {
            const video = await Video.findOrFail(params.id)
            video.name = request.input('name')
            video.description = request.input('description')

            await video.save()
            return response.redirect().toRoute('videos/show', {id: params.id})
        }
        catch {
            return response.redirect().toRoute('videos/edit', {id: params.id})
        }
    }
    public async destroy({params, response}: HttpContextContract) {

            const video = await Video.findOrFail(params.id)
            await video.delete()
            return response.redirect().toRoute('videos/list')

        
    }
}
