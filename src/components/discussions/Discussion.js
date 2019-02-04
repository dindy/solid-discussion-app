import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './Discussion.styles'
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import CardContent from '@material-ui/core/CardContent'
import { ListItem } from '@material-ui/core';

class Discussion extends Component {

    renderMessagesListItems() {
        const discussionId = this.props.discussionsState.selected
        const persons = this.props.personsState.byId
        const classes = this.props.classes
        
        return this.props.messagesState.allIds
            .map(messageId => this.props.messagesState.byId[messageId])
            .filter(message => message.discussionId == discussionId)
            .sort((a, b) => b.created - a.created)
            .map(message => {
                const name = typeof persons[message.creatorId] !== 'undefined' ? 
                    persons[message.creatorId].name : 'Unknown' 
                
                const avatarUrl = typeof persons[message.creatorId] !== 'undefined' ? 
                    persons[message.creatorId].avatarUrl : null
                
                return (
                    <ListItem 
                        key={message.id}
                        className={classes.listItem}
                        >
                        <Avatar                        
                            alt={name}
                            src={avatarUrl}
                            className={classes.avatar}
                            />
                        <ListItemText 
                            className={classes.messageItemText}
                            primary={message.content} 
                            secondary={
                                <span className={classes.messageMeta}>
                                    {name + ', ' + message.created.toISOString()}
                                </span>
                            } 
                            />
                    </ListItem>
                )
            })
    }

    render() {
        const { classes } = this.props

        return (
            <Card className={classes.card}> 
                <CardContent className={classes.cardContent}>
                    <List>
                        { this.renderMessagesListItems() }
                    </List>
                </CardContent>                
            </Card>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Discussion)    