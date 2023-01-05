import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'

export default class VideosController {

    public async list({view}: HttpContextContract) {
        const videos = await Video.all()
        return view.render('videos/list', {videos: videos})
    }

}
