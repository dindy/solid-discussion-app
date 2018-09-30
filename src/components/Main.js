import React, { Component } from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles'
import styles from './Main.styles'

class Main extends Component {


    render() {
        
        const { classes, layoutState, login, userState } = this.props
        const loginButton = () => {
            if  (!userState.authenticated) return (
                <Button variant="outlined" color="primary" onClick={login}>Log in with Solid</Button>
            )
            return null
        }

        return (
            <main
                className={classNames(classes.content, classes[`content-left`], {
                    [classes.contentShift]: layoutState.leftDrawer.open,
                    [classes[`contentShift-left`]]: layoutState.leftDrawer.open,
                })}
            >
                <div className={classes.drawerHeader} />
                { loginButton() }
            </main>
            
        )
    }
}

export default withStyles(styles, { withTheme: true })(Main)