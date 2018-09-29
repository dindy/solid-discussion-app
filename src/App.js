import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LeftDrawer from './components/LeftDrawer';
import AppBarWrapper from './components/AppBarWrapper';
import styles from './styles'
import Main from "./components/Main";

class App extends Component {

    render() {
        
        const { classes, theme } = this.props

        return (
            <div className={classes.appFrame}>
                <AppBarWrapper classes={classes} theme={theme} />
                <LeftDrawer classes={classes} theme={theme} />
                <Main classes={classes} theme={theme} />
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
