import apisauce from 'apisauce'

const create = (baseURL = 'https://api.boxing.audienciazero.net') => {
    const api = apisauce.create({
        baseURL,
        headers: {},
        timeout: 40 * 1000
    })

    // Wrap api's addMonitor to allow the calling code to attach
    // additional monitors in the future.  But only in __DEV__ and only
    // if we've attached Reactotron to console (it isn't during unit tests).
    if (__DEV__ && console.tron) {
        api.addMonitor(console.tron.apisauce)
    }


    api.addResponseTransform(response => {
        if (response.status == 429) {
            console.error('429 from api')
        }
    })


    return api;
}

export default create()