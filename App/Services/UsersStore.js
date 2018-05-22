import {Model} from './base/Model'
import Collection from "./base/Collection"


export class User extends Model {
    constructor(attributes = {}) {
        super(attributes)
    }

    urlRoot() {
        return "/users/"
    }
}

export class Users extends Collection {
    urlRoot() {
        return "/users/"
    }

    model() {
        return User
    }
}