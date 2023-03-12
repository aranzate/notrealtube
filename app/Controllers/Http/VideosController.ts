
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import VideoHistory from 'App/Models/VideoHistory'
import VideoUpload from 'App/Models/VideoUpload'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class VideosController {
    public async list({view}: HttpContextContract) {
        const videos = await Video.all()
        return view.render('videos/list', {videos: videos})
    }

    public async show({ params, view, response }: HttpContextContract) {
        try {
            const uploadUserId = await (await Database.from('video_uploads').select('user_id').where('video_id', params.id)).map(row => row.user_id)
            const userName = await (await Database.from('users').select('name').where('id', uploadUserId)).map(row => row.name)
            const video_uploads = await VideoUpload.all()
            const users = await User.all()

            const video = await Video.findOrFail(params.id)
            const videoLink = 'https://www.youtube.com/embed/' + video.link.substring(32, 90)
            const videoName = video.name
            const videoDescription = video.description
            const videoViews = video.views++
            await video.save()

            return view.render('videos/show', { videoName: videoName, videoLink: videoLink, videoDescription: videoDescription, videoId: params.id, videoViews: videoViews, video_uploads : video_uploads, users : users, userName : userName})
        } catch {
            return response.redirect().toRoute('videos/list')
        }
        
    }

    public async addToHistory({params, auth, response}: HttpContextContract) {
        const video = await Video.findOrFail(params.id)
        video.views--
        await video.save()
        await VideoHistory.firstOrCreate({
            videoId: params.id,
            userId: auth.user?.id
        })
        return response.redirect().toRoute('videos/show', {id: params.id})
    }

    public async history({view, auth}: HttpContextContract) {
        const video_uploads = await VideoUpload.all()
        const users = await User.all()
        const userId = auth.user?.id

        const histories = await Database.rawQuery('select `video_id` from `video_histories` where `user_id` = ' + userId)
        const videoIds = histories.map(row => row.video_id)
        const videos = await Database.from('videos').whereIn(`id`, videoIds)
        return view.render('videos/viewed', {videos: videos, video_uploads : video_uploads, users : users})
    }

    public async latest({view}: HttpContextContract) {
        const users = await User.all()
        const videos = await Database.from('videos').select().orderBy('created_at', 'desc').limit(3)

        return view.render('videos/latest', {videos: videos, users : users})
    }

    public async create({view}: HttpContextContract) {
        return view.render('videos/upload', {})
    }

    public async store({request, response, auth}: HttpContextContract) {
        const video = await Video.create({
            name: request.input('name'), 
            description: request.input('description'), 
            link: request.input('link')
        })
        await VideoUpload.create({
            userId: auth.user?.id,
            videoId: video.id
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
