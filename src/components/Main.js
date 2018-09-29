import React, { Component } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class Main extends Component {


    render() {
        
        const { classes, layoutState, login, userState, theme } = this.props
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

export default Main