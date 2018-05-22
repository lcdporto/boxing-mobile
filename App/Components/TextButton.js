import React, {Component} from 'react';
import {TextButton, RaisedTextButton} from 'react-native-material-buttons';
import ApplicationStyles from "../ApplicationStyles";

const FlatButton = (props) => {
    return (
        <TextButton {...props} color={ApplicationStyles.Colors.primary}/>
    );
}

const RaisedButton = (props) => {
    return (
        <RaisedTextButton {...props} color={ApplicationStyles.Colors.primary}/>
    );
}

export {FlatButton, RaisedButton}