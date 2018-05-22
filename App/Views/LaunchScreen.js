import React from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TextInput
} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {observer, inject} from 'mobx-react/native';
import ApplicationStyles from '../ApplicationStyles'
import {FlatButton, RaisedButton} from "../Components/TextButton";
import authStore from '../Services/AuthStore'

@observer
class LaunchScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };
    }

    componentWillReact = () => {
        const {navigation} = this.props
        if (authStore.isLoggedIn()) {
            navigation.goBack()
        }
    }

    handleSubmit = () => {
        const {email, password} = this.state
        authStore.login(email, password)
    };

    forgotPassword = () => {
        const {navigate} = this.props.navigation
        const {email} = this.state

        navigate("RecoverPasswordScreen", {email: email})
    }

    loginButton = () => {
        if (authStore.authState == authStore.states.LOGGING_IN) {
            return (
                <Text>Loading</Text>
            );
        }

        return (
            <RaisedButton onPress={() => this.handleSubmit()} title='Sign in'/>
        );
    };


    renderEmailField = () => {
        const {email} = this.state;
        return (
            <View rounded style={styles.ViewRounded}>
                <TextInput
                    ref="email"
                    style={[styles.textInput]}
                    value={email}
                    placeholder="Email"
                    editable={!authStore.fetching}
                    keyboardType="email-address"
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={email => this.setState({email})}
                    underlineColorAndroid="transparent"
                    onSubmitEditing={() => this.refs.password._root.focus()}
                />
            </View>
        );
    }

    renderPasswordField = () => {
        const {password} = this.state
        return (
            <View rounded style={styles.ViewRounded}>
                <TextInput
                    ref='password'
                    style={[styles.textInput]}
                    value={password}
                    placeholder="Password"
                    editable={!authStore.fetching}
                    keyboardType='default'
                    returnKeyType={'go'}
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={password => this.setState({password})}
                    underlineColorAndroid='transparent'
                    onSubmitEditing={() => {
                        this.handleSubmit()
                    }}
                />
            </View>
        )
    }

    renderErrors = () => {
        if (!authStore.loginRequest || authStore.loginRequest.ok) {
            return null;
        }
        return (
            Object.keys(authStore.loginRequest.data).map((key) => (
                <View key={key}>
                    <Text style={styles.textError}>
                        {authStore.loginRequest.data[key]}
                    </Text>
                </View>
            ))
        )
    }

    createForm = () => {
        return (
            <View style={styles.layoutCol}>
                {this.renderEmailField()}

                {this.renderPasswordField()}

                {this.renderErrors()}

                {this.loginButton()}

                <Text style={[styles.textCenter, styles.textInfo, styles.textSizeS, {marginBottom: 10}]}
                      onPress={this.forgotPassword}>
                    Forgot your password?
                </Text>

                <View style={{height: 40}}></View>
            </View>
        )
    }

    render() {
        if (authStore.state == authStore.states.LOGGED_IN) {

        }

        return (
            <View style={[styles.container, styles.backgroundPrimary]}>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <KeyboardAwareScrollView
                        style={[styles.container]}
                        extraHeight={20}
                    >
                        {this.createForm()}
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}


export default LaunchScreen;

const styles = StyleSheet.create({
    ...ApplicationStyles.styles,
    ViewRounded: {
        borderColor: "transparent",
        marginVertical: 10,
        backgroundColor: ApplicationStyles.hexToRGBA(ApplicationStyles.Colors.accent, 0.3),
        paddingHorizontal: 10
    },
    textInput: {
        color: "white",
        opacity: 0.7,
        textAlign: "center"
    },
    footer: {
        padding: 10,
        borderTopColor: "white",
        borderTopWidth: StyleSheet.hairlineWidth
    },
    passwordsIcon: {
        position: "absolute",
        right: 5,
        color: "white",
        opacity: 0.7
    }
})