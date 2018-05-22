// @flow
import {observable, action, IObservableArray, runInAction, toJS} from 'mobx'
import {
    isEmpty,
    filter,
    isMatch,
    find,
    difference,
    debounce,
    map,
    last
} from 'lodash'
import api from '../../Services/base/API'

export default class Collection {
    @observable request = null
    @observable errors = observable.map()
    @observable models = []
    @observable response = null


    constructor() {
    }


    urlRoot() {
        throw new Error('You must implement this method')
    }

    url() {
        return this.urlRoot()
    }

    /**
     * Specifies the model class for that collection
     */
    model() {
        throw new Error('Collections must implement the model method')
    }

    /**
     * Returns a JSON representation
     * of the collection
     */
    toJS() {
        return toJS(this.models)
    }

    /**
     * Returns a shallow array representation
     * of the collection
     */
    toArray() {
        return this.models.slice()
    }

    /**
     * Questions whether the request exists
     * and matches a certain label
     */
    isRequest(label) {
        if (!this.request) return false

        return this.request.label === label
    }

    /**
     * Wether the collection is empty
     */
    isEmpty() {
        return isEmpty(this.models)
    }

    /**
     * Gets the ids of all the items in the collection
     */
    _ids() {
        return map(this.models, item => item.id).filter(Boolean)
    }

    /**
     * Get a resource at a given position
     */
    at(index) {
        return this.models[index]
    }

    /**
     * Get a resource with the given id or uuid
     */
    get(id) {
        return this.models.find(item => item.id === id)
    }

    /**
     * The whinny version of the `get` method
     */
    mustGet(id) {
        const model = this.get(id)

        if (!model) throw Error(`Invariant: Model must be found with id: ${id}`)

        return model
    }

    /**
     * Get resources matching criteria
     */
    filter(query: { [key: string]: any } = {}): Array<T> {
        return filter(this.models, ({attributes}) => {
            return isMatch(attributes.toJS(), query)
        })
    }

    /**
     * Finds an element with the given matcher
     */
    find(query) {
        return find(this.models, ({attributes}) => {
            return isMatch(attributes.toJS(), query)
        })
    }

    /**
     * The whinny version of `find`
     */
    mustFind(query) {
        const model = this.find(query)

        if (!model) {
            const conditions = JSON.stringify(query)
            throw Error(`Invariant: Model must be found with: ${conditions}`)
        }

        return model
    }

    /**
     * Adds a collection of models.
     * Returns the added models.
     */
    @action
    add(data) {
        const models = data.map(d => this.build(d))
        this.models.push(...models)
        return models
    }

    /**
     * Resets a collection of models.
     * Returns the added models.
     */
    @action
    reset(data) {
        const models = data.map(d => this.build(d))
        this.models = models
        return models
    }

    /**
     * Removes the model with the given ids or uuids
     */
    @action
    remove(ids) {
        ids.forEach(id => {
            const model = this.get(id)
            if (!model) return

            this.models.splice(this.models.indexOf(model), 1)
        })
    }

    /**
     * Sets the resources into the collection.
     *
     * You can disable adding, changing or removing.
     */
    @action
    set(resources, add = true, change = true, remove = true) {
        if (remove) {
            const ids = resources.map(r => r.id)
            const toRemove = difference(this._ids(), ids)
            if (toRemove.length) this.remove(toRemove)
        }

        resources.forEach(resource => {
            const model = this.get(resource.id)

            if (model && change) model.set(resource)
            if (!model && add) this.add([resource])
        })
    }

    /**
     * Creates a new model instance with the given attributes
     */
    @action
    build(attributes = {}) {
        const ModelClass = this.model()
        const model = new ModelClass(attributes)
        model.collection = this

        return model
    }

    /**
     * Creates the model and saves it on the backend
     *
     * The default behaviour is optimistic but this
     * can be tuned.
     */
    create(attributes = {}) {
        let instance = this.build(attributes)
        this.models.push(instance)
        instance.save()
        return instance
    }

    /**
     * Fetches the models from the backend.
     *
     * It uses `set` internally so you can
     * use the options to disable adding, changing
     * or removing.
     */
    @action
    async fetch(options, remove = true) {
        this.request = 'fetching'

        this.response = await api.get(this.url(), options)

        if (this.response.ok) {
            runInAction('fetch-done', () => {
                this.set(this.response.data.results, true, true, remove)
                this.request = null
                this.errors.clear()
            })
        } else {
            runInAction('fetch-error', () => {
                this.errors.replace(this.response.data)
                this.request = null
            })
        }

        return this.response.data
    }

    @action
    async refresh() {
        return this.fetch(this.response.config.params)
    }

}