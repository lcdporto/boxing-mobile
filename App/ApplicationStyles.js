

String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};

const BASE_MARGIN = 20

const ApplicationStyles = {
    styles: {
        mainContainer: {
            flex: 1
        },
        backgroundImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        container: {
            flex: 1,
            backgroundColor: "transparent",
            padding: BASE_MARGIN
        },
        textBold: {
            fontWeight: "bold"
        },
        textFade: {
            opacity: 0.6
        },
        layoutRow: {
            flexDirection: 'row'
        },
        layoutCol: {
            flexDirection: 'column'
        },
        centerContent: {
            justifyContent: "center",
            alignItems: "center"
        }
    }
};

/*
* COLORS STUFF
 */
ApplicationStyles.hexToRGBA = function (hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}

ApplicationStyles.Colors = {
    primary: '#00BCD4',
    accent: '#FFC107',
    white: "#fff",
    black: "#212121",
    invisible: "transparent"
}


for (key in ApplicationStyles.Colors) {
    ApplicationStyles.styles['text' + key.capitalize()] = {color: ApplicationStyles.Colors[key]}
    ApplicationStyles.styles['background' + key.capitalize()] = {backgroundColor: ApplicationStyles.Colors[key]}
}

/*
TEXT STUFF
 */
['center', 'justify', 'left', 'right'].map((alignment) => ApplicationStyles.styles['text' + alignment.capitalize()] = {textAlign: alignment});

const sizes = {
    sizeXS: 12,
    sizeS: 14,
    sizeM: 16,
    sizeL: 20,
    sizeXL: 30
}


for (key in sizes) {
    ApplicationStyles.styles['text' + key.capitalize()] = {fontSize: sizes[key]}
}

export default ApplicationStyles
