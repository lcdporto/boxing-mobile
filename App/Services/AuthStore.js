import {AsyncStorage} from 'react-native';

import {observable, createTransformer, action, computed, autorun, observer} from 'mobx';

import {persist, create} from 'mobx-persist'

import {User} from './UsersStore'

import API from '../Services/base/API'

class AuthStore {
    static states = {
        STARTING: 'starting',
        LOGGING_IN: 'logging_in',
        LOGGED_IN: 'logged_in',
        LOGGGED_OUT: 'logged_out'
    };
    states = AuthStore.states;

    @persist @observable token = null
    @persist @observable blockedUsers = ''
    @observable user = null
    @observable authState = AuthStore.states.STARTING
    @observable loginRequest = null
    @observable recoverPasswordRequest = null
    @observable recoverPassowrdRequesting = false

    isLoggedIn() {
        return this.authState === AuthStore.states.LOGGED_IN;
    }

    @action
    async hydrateComplete() {
        if (this.token) {
            API.setHeader('Authorization', 'Bearer ' + this.token)
            this.user = await this._getUserData()
            if (this.user == null) {
                this.logout()
            }
            this.authState = AuthStore.states.LOGGED_IN;
        } else {
            this.authState = AuthStore.states.LOGGGED_OUT
        }
    }

    async _getUserData() {
        let user = new User({id: 'me'});
        let response = await user.fetch()
        if (response.response.ok) {
            return user
        } else {
            return null;
        }
    }

    @action
    async login(email, password) {
        this.authState = AuthStore.states.LOGGING_IN

        this.loginRequest = await API.post('/api-token-auth/', {email, password})

        if (this.loginRequest.ok) {
            this.token = this.loginRequest.data.token
            API.setHeader('Authorization', 'Bearer ' + this.token)
            this.user = await this._getUserData()
            this.authState = AuthStore.states.LOGGED_IN
        } else {
            this.authState = AuthStore.states.LOGGGED_OUT
        }
    }

    @action
    logout() {
        this.token = null;
        API.setHeader('Authorization', null)
        this.authState = AuthStore.states.LOGGGED_OUT
    }

    @action
    resetRecoverPasswordStatus() {
        this.recoverPasswordRequest = null
        this.recoverPassowrdRequesting = false
    }

    @action
    async recoverPassword(email) {
        this.recoverPassowrdRequesting = true
        this.recoverPasswordRequest = await API.post('/users/reset_password/', {email: email})
        this.recoverPassowrdRequesting = false
    }
}

export default authStore = new AuthStore();

const hydrate = create({storage: AsyncStorage, jsonify: true});
hydrate('user', authStore).then(() => {
    authStore.hydrateComplete()
});
