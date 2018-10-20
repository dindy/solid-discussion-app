import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import ListSubheader from '@material-ui/core/ListSubheader'
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

    displayParticipantsListItems = (participantsState, personsState, discussionId) => this
        .getParticipants(participantsState, personsState, discussionId)
        .map(participant => (
            <ListItem key={ participant.id }>{ participant.name }</ListItem>
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
                    <Typography className={classes.title} variant="body2" color="textPrimary">
                        Parameters
                    </Typography>                    
                    <IconButton 
                        className={classes.drawerHeaderIconButton} 
                        onClick={this.handleDrawerToggle}
                        >
                        <CloseIcon />
                    </IconButton>
                </div>           
                <ListSubheader>
                    Members
                </ListSubheader>
                <List>
                    { this.displayParticipantsListItems(participantsState, personsState, discussionId) }
                </List>                 
            </Drawer>  
        )
    }
}
    
export default withStyles(styles, { withTheme: true })(LeftDrawer)