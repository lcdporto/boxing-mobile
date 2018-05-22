import {
    observable,
    action,
    ObservableMap,
    computed,
    runInAction,
    autorun
} from 'mobx'

import api from '../../Services/base/API'


export class Model {
    @observable request = null
    @observable response = null
    @observable errors = observable.map()
    @observable attributes = observable.map()

    constructor(attributes = {}) {
        this.attributes.merge(attributes)
    }

    toJS() {
        return this.attributes.toJS()
    }

    get primaryKey() {
        return 'id'
    }

    urlRoot() {
        throw new Error('`urlRoot` method not implemented')
    }

    url() {
        let urlRoot = this.urlRoot()

        if (this.isNew) {
            return urlRoot
        } else {
            return `${urlRoot}${this.get(this.primaryKey)}/`
        }
    }


    @computed
    get isNew() {
        return !this.has(this.primaryKey)
    }

    get(attribute) {
        return this.attributes.get(attribute)
    }

    has(attribute) {
        return this.attributes.has(attribute)
    }

    get id() {
        return this.get(this.primaryKey)
    }

    @action
    set(data) {
        this.attributes.merge(data)
    }


    @action
    async fetch(options = {}) {
        this.request = 'fetching'

        this.response = await api.get(this.url())

        if (this.response.ok) {
            runInAction('fetch-done', () => {
                this.set(this.response.data)
                this.request = null
                this.errors.clear()
            })
        } else {
            runInAction('fetch-error', () => {
                this.errors.replace(this.response.data)
                this.request = null
            })
        }

        return this
    }


    @action
    async save(attributes = {}, patch = false) {
        this.attributes.merge(attributes)

        if (!this.has(this.primaryKey)) {
            return this._create()
        }

        return this._update(patch)
    }

    @action
    async _update(patch = false) {
        this.request = 'updating'

        if (patch) {
            let data = {}
            patch.map((field) => {
                var tempObj = {}
                tempObj[field] = this.get(field)
                Object.assign(data, tempObj)
            })
            this.response = await api.patch(this.url(), data)
        } else {
            this.response = await api.put(this.url(), this.toJS())
        }


        if (this.response.ok) {
            runInAction('save-done', () => {
                this.request = null
                this.errors.clear()
                this.set(this.response.data)
            })
        } else {
            runInAction('save-fail', () => {
                // TODO this.set(originalAttributes)
                this.errors.replace(this.response.data)
                this.request = null
            })
        }
        return this.response
    }

    @action
    async _create() {
        this.request = 'creating'


        this.response = await api.post(this.url(), this.toJS())
        if (this.response.ok) {
            runInAction('create-done', () => {
                this.set(this.response.data)
                this.request = null
                this.errors.clear()
            })
        } else {
            runInAction('create-error', () => {
                this.errors.replace(this.response.data)
                this.request = null
            })
        }

        return this.response
    }

    @action
    async destroy() {
        const label = 'destroying'
        this.request = 'deleting'


        this.response = await api.delete(this.url())

        if (this.response.ok) {
            runInAction('destroy-done', () => {
                if (this.collection) {
                    this.collection.remove([this.id])
                }
                this.errors.clear()
                this.request = null
            })
        } else {
            runInAction('destroy-fail', () => {
                this.request = null
                this.errors.replace(this.response.data)
            })
        }


        return null
    }

}
