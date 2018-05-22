import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react/native'
import {createStackNavigator} from 'react-navigation';
import {observable} from 'mobx'
import LaunchScreen from "./App/Views/LaunchScreen";


@observer
export default class App extends React.Component {

    @observable variavel = 1;

    render() {
        return (
            <GuestNav/>
        );
    }
}


const GuestNav = createStackNavigator({
    LaunchScreen: {
        screen: LaunchScreen,
        navigationOptions: () => ({
            header: null
        })
    }
}, {
    // Default config for all screens
    headerMode: 'screen',
    navigationOptions: ({navigation}) => ({
        headerTintColor: "white"
    })
})

/*
// Manifest of possible screens
export


const MainNav = StackNavigator({
    ItemsList: {
        screen: ItemsList,
        navigationOptions: () => ({
            header: null
        })
    },
    ItemDetails: {
        screen: ItemDetails,
        navigationOptions: () => ({
            title: 'Options'
        })
    }
}, {
    // Default config for all screens
    headerMode: 'screen',
    navigationOptions: ({navigation}) => ({
        headerTintColor: "white",
        headerStyle: {backgroundColor: ApplicationStyles.Colors.primary}
    })
})
*/