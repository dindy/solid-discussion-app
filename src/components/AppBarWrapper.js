import React, { Component } from 'react'
import classNames from 'classnames'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import { withStyles } from '@material-ui/core/styles'
import styles from './AppBarWrapper.styles'

class AppBarWrapper extends Component {

    handleDrawerToggle = () => this.props.toggleLeftDrawer()
    
    handleDiscussionDrawerToggle = () => this.props.toggleDiscussionDrawer()

    render() {

        const { classes, layoutState, discussionsState } = this.props
        console.log(this.props)
        const selectedDiscussion = discussionsState.selected === null ?
            null : discussionsState.entities.byId[discussionsState.selected] || null
        const title = selectedDiscussion === null ? 
            'Solid Discussion App' : selectedDiscussion.title

        return (
            <AppBar
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: layoutState.leftDrawer.open,
                    [classes[`appBarShift-left`]]: layoutState.leftDrawer.open,
                })}
            >
                <Toolbar disableGutters={!layoutState.leftDrawer.open} className={classes.toolBar}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerToggle}
                        className={classNames(classes.menuButton, layoutState.leftDrawer.open && classes.hide)}
                        >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" noWrap>
                        { title }
                    </Typography>
                    <div className={classes.discussionSettingsButtonWrapper}>
                        <IconButton
                            color="inherit"
                            aria-label="Open discussion settings"
                            onClick={this.handleDiscussionDrawerToggle}
                            className={classNames(
                                classes.discussionSettingsButton, 
                                (discussionsState.selected === null || layoutState.discussionDrawer.open) && classes.hide
                            )}
                            >
                            <SettingsIcon />
                        </IconButton>                    
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AppBarWrapper)