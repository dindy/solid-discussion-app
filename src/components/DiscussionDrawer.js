import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './DiscussionDrawer.styles'

class LeftDrawer extends Component {

    handleDrawerToggle = () => this.props.toggleDiscussionDrawer()
    
    handleSelectDiscussion = (uri) => () => this.props.selectDiscussion(uri)

    getParticipants = (participantsState, personsState, discussionId) => participantsState.allIds
        .map(participantId => participantsState.byId[participantId])
        .filter(participant => participant.discussionId == discussionId && participant.personId !== null)
        .map(participant => {
            const person = personsState.byId[participant.personId]
            return (typeof person !== 'undefined') ? { 
                ...participant, 
                name: person.name, 
                avatarUrl: person.avatarUrl 
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
                <ListSubheader className={classes.participantsSubheader}>
                    Participants
                    <Button 
                        className={classes.addParticipantButton}
                        variant="outlined"
                        >Add participant
                    </Button>
                </ListSubheader>
                <List>
                    { this.displayParticipantsListItems(participantsState, personsState, discussionId, classes) }
                </List>                 
            </Drawer>  
        )
    }
}
    
export default withStyles(styles, { withTheme: true })(LeftDrawer)