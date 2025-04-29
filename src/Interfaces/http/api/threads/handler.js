const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase')

class ThreadsHandler {
    constructor(container) {
        this._container = container
        this.postThreadHandler = this.postThreadHandler.bind(this)
        this.getThreadHandler = this.getThreadHandler.bind(this)
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)

        const { username } = await request.auth.credentials
        const payload = request.payload

        const addedThread = await addThreadUseCase.execute({
            username: username,
            title: payload.title,
            body: payload.body,
        })

        const response = h.response({
            status: 'success',
            data: {
                addedThread: {
                    id: addedThread.id,
                    title: addedThread.title,
                    owner: addedThread.username
                }
            }
        })
        response.code(201)
        return response
    }

    async getThreadHandler(request, h) {
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name)
        const id = request.params.thread_id
        const payload = {
            id: id
        }

        const threadDetail = await getThreadUseCase.execute(payload)

        const response = h.response({
            status: 'success',
            data: {
                thread: threadDetail
            }
        })
        response.code(200)
        
        return response
    }
}

module.exports = ThreadsHandler