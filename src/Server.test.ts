import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import Server from './Server'

const server = new Server()

chai.use(chaiHttp);
chai.should();
describe('Keys api', () => {

    before(async () => {
        await server.start()
    })


    describe('PUT /api/keys', () => {
        it('should fail to put invalid data', async () => {
            const result = await chai.request(server.app).put('/api/keys').send({ invalidData: '123' })
            expect(result.status).eqls(400)
        })

        it('should put data', async () => {
            const result = await chai.request(server.app).put('/api/keys').send({
                encrypterName: 'test1',
                salt: 'test2',
                keysBlob: 'test3'
            })
            expect(result.status).eqls(200)
            expect(result.body).is.a(Object.name)
        })

        it('should update data', async () => {
            const newValue = 'new test1'
            const result = await chai.request(server.app).put('/api/keys').send({
                encrypterName: newValue,
                salt: 'test2',
                keysBlob: 'test3'
            })
            expect(result.status).eqls(200)
            expect(result.body).is.a(Object.name)
            expect(result.body.encrypterName).eqls(newValue)
        })
    })

    describe('GET /api/keys', () => {
        it('should get data', async () => {
            const result = await chai.request(server.app).get('/api/keys')
            expect(result.status).eqls(200)
            expect(result.body).is.a(Object.name)
        })
    })

    describe('DELETE /api/keys', () => {
        it('should delete data', async () => {
            const result = await chai.request(server.app).delete('/api/keys')
            expect(result.status).eqls(200)
            expect(result.body).is.a(Object.name)
            expect(result.body.message).eqls('ok')
        })
    })

    after(async () => {
        await server.shutdown()
    })
});