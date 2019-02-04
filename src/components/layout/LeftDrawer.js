import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './LeftDrawer.styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

class LeftDrawer extends Component {

    handleDrawerToggle = () => this.props.toggleLeftDrawer()
    
    handleSelectDiscussion = (uri) => () => this.props.selectDiscussion(uri)

    renderNewDiscussionButton() {
        const authenticated = this.props.userState.authenticated 
        const newDiscussionFormOpen = this.props.layoutState.newDiscussionForm.open
        const classes = this.props.classes
        const newDiscussion = this.props.newDiscussion

        return authenticated && !newDiscussionFormOpen ? (
            <IconButton className={classes.addButton} onClick={newDiscussion}>
                <AddIcon />
            </IconButton>                           
        ) : null
    }

    render() {
        const { 
            classes, 
            theme, 
            layoutState, 
            userState, 
            personsState, 
            discussionsState, 
        } = this.props
        
        const userPerson = personsState.byId[userState.id] || null

        const renderUserData = () => {
            return userState.authenticated && userPerson !== null ? (
                <div>
                    <Avatar
                        alt={userPerson.name}
                        src={userPerson.avatarUrl}
                        className={classNames(classes.avatar, classes.bigAvatar)}
                    />  
                    <Typography className={classes.avatarName} 
                        variant="body2" 
                        color="textPrimary"
                        >
                        {userPerson.name}
                    </Typography>                                      
                </div>
            ) : null
        }

        const discussionsList = () => {
            const { byId, allIds } = discussionsState.entities
            return allIds.map(id => ( 
                <ListItem 
                    button 
                    key={id}
                    onClick={this.handleSelectDiscussion(id)}
                    selected={discussionsState.selected == id}
                    >
                    <ChatBubbleOutlineIcon 
                        className={classes.bubbleIcon}
                        />
                    <Typography>{byId[id].title || id}</Typography>
                </ListItem>)
            )
        }

        return (
            <Drawer
                variant="persistent"
                anchor='left'
                open={layoutState.leftDrawer.open}
                classes={{paper: classes.drawerPaper,}}
            >
                <div className={classes.drawerHeader}>
                    {renderUserData()}
                    {/* <IconButton className={classes.drawerHeaderIconButton} onClick={this.handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton> */}
                </div>
                
                <Divider />
                <List
                    component="nav"
                    subheader={<ListSubheader
                            className={classes.listSubheader}    
                            >Discussions{ this.renderNewDiscussionButton() }
                        </ListSubheader>}
                >
                    {discussionsList()}
                </List>
            </Drawer>  
        )
    }
}
    
export default withStyles(styles, { withTheme: true })(LeftDrawer)