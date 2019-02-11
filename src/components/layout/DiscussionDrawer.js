import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './DiscussionDrawer.styles'

class DiscussionDrawer extends Component {

    handleDrawerToggle = () => this.props.toggleDiscussionDrawer()
    
    handleAddParticipant = () => this.props.addParticipant()

    getParticipants = (participantsState, personsState, discussionId) => participantsState.allIds
        .map(participantId => participantsState.byId[participantId])
        .filter(participant => participant.discussionId == discussionId && participant.personId !== null)
        .map(participant => {
            const person = personsState.byId[participant.personId]
            return (typeof person !== 'undefined') ? { 
                ...participant, 
                name: person.name || 'Unknown', 
                avatarUrl: person.avatarUrl || 'https://png.pngtree.com/svg/20161027/service_default_avatar_182956.png' 
            } : participant
    })

    displayParticipantsListItems = (participantsState, personsState, discussionId, classes) => this
        .getParticipants(participantsState, personsState, discussionId)
        .map(participant => (
            <ListItem key={ participant.id }>
                    <Avatar
                        alt={participant.name}
                        src={participant.avatarUrl}
                        className={classNames(classes.avatar, classes.mediumAvatar)}
                    />  
                    <Typography className={classes.avatarName} variant="body2" color="textPrimary">
                        {participant.name}
                    </Typography>                
            </ListItem>
        ))

    renderAddParticipantButton() { 
        const authenticated = this.props.userState.authenticated 
        const classes = this.props.classes
        const handleAddParticipant = this.props.addParticipant

        return authenticated ? (
            <IconButton className={classes.addButton} onClick={handleAddParticipant}>
                <AddIcon />
            </IconButton>                           
        ) : null
    }

    render() {
        const { 
            theme, 
            classes, 
            userState, 
            layoutState, 
            personsState, 
            discussionsState, 
            participantsState,
            toggleDiscussionDrawer,
        } = this.props
        
        const discussionId = discussionsState.selected
            
        return (
            <Drawer
                variant="persistent"
                anchor='right'
                open={layoutState.discussionDrawer.open}
                classes={{paper: classes.drawerPaper,}}
                >
                <div className={classes.drawerHeader}>
                    <IconButton 
                        className={classes.drawerHeaderIconButton} 
                        onClick={this.handleDrawerToggle}
                        >
                        <CloseIcon />
                    </IconButton>
                </div>           
                <List
                    component="nav"
                    subheader={
                        <ListSubheader
                            className={classes.listSubheader}
                            >Participants{ this.renderAddParticipantButton() }
                        </ListSubheader>}
                    >
                    { this.displayParticipantsListItems(participantsState, personsState, discussionId, classes) }
                </List>                 
            </Drawer>  
        ) 
    }
}
    
export default withStyles(styles, { withTheme: true })(DiscussionDrawer)