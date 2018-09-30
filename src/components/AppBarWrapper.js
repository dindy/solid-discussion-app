import React, { Component } from 'react'
import classNames from 'classnames'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import styles from './AppBarWrapper.styles'

class AppBarWrapper extends Component {

    handleDrawerToggle = () => this.props.toggleLeftDrawer()

    render() {

        const { classes, layoutState } = this.props

        return (
            <AppBar
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: layoutState.leftDrawer.open,
                    [classes[`appBarShift-left`]]: layoutState.leftDrawer.open,
                })}
            >
                <Toolbar disableGutters={!layoutState.leftDrawer.open}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerToggle}
                        className={classNames(classes.menuButton, layoutState.leftDrawer.open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" noWrap>
                        Solid Discussion App
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AppBarWrapper)