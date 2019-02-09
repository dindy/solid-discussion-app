import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './Discussion.styles'
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import CardContent from '@material-ui/core/CardContent'
import Message from './Message'
import InputBase from '@material-ui/core/InputBase';
import { Button } from '@material-ui/core';
import ScrollToBottom from 'react-scroll-to-bottom'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import moment from 'moment'

class Discussion extends Component {

    renderMessages() {
        const discussionId = this.props.discussionsState.selected
        const personsById = this.props.personsState.byId
        const user = this.props.userState
        const classes = this.props.classes
        const messagesEntities = this.props.messagesState
        
        const getMessageFromId = (messagesById, messageId) => messagesById[messageId]
        const filterMessageByDiscussion = (message, discussionId) => message.discussionId === discussionId
        const sortMessageByDateDesc = (a,b) => a.created - b.created
        const completeMessageData = (message, personsById, user) => {
            const hasPerson = typeof personsById[message.creatorId] !== 'undefined'
            let name = 'Unknown'
            let avatarUrl = null
            if (hasPerson) { 
                name = personsById[message.creatorId].name
                avatarUrl = personsById[message.creatorId].avatarUrl
            }
            return Object.assign({}, message, { 
                user: { name, avatarUrl },
                alignRight: user.id === message.creatorId
            })
        }

        const groupMessage = (groups, message, index, messages) => {
            
            if (index === 0) return groups.concat({
                id: index, 
                messages: [{...message, displayMeta: true}],
                user: {name: message.user.name, avatarUrl: message.user.avatarUrl},
                created: message.created,
            })

            const lastMessage = messages[index - 1]
            const isFromSamePerson = lastMessage.creatorId === message.creatorId
            const milliSecTreshold = 1000 * 60 * 5
            const isCloseInTime = message.created.getTime() - lastMessage.created.getTime() < milliSecTreshold 
           
            if (!isFromSamePerson || !isCloseInTime)
                return groups.concat({
                    id: index, 
                    messages: [{...message, displayMeta: true}],
                    user: {name: message.user.name, avatarUrl: message.user.avatarUrl},
                    created: message.created,
                })
            
            const lastGroupIndex = groups.length - 1

            return groups.map((group, groupIndex) => {
                return (lastGroupIndex !== groupIndex) ? group : 
                    {...group, messages: 
                        [...group.messages, {...message, displayMeta: false}]
                    }
                }
            )
        }

        const renderMessageComponent = (message) => (
            <Message 
                key={message.id}
                message={message} 
                alignRight={message.alignRight}
                displayMeta={message.displayMeta}/>                                
        )

        const renderGroupComponent = (group, classes) => (
            <Card key={group.id} className={classes.card}> 
                <CardContent className={classes.cardContent}>
                    <List>
                        <ListSubheader
                            className={classes.listSubheader} 
                            primary={group.user.name}>
                            <Avatar alt={group.user.name}
                                src={group.user.avatarUrl}
                                className={classes.avatar}/>                                    
                            <ListItemText className={classes.messageItemText}
                                secondary={group.user.name + ', ' + moment(group.created.toISOString()).fromNow()}
                                />                                
                        </ListSubheader>                         
                        {group.messages.map(messages => renderMessageComponent(messages))}
                    </List>
                </CardContent>                
            </Card>                
        )              

        const renderGroups = messagesEntities.allIds
            .map(messageId => getMessageFromId(messagesEntities.byId, messageId))
            .filter(message => filterMessageByDiscussion(message, discussionId))
            .sort((a, b) => sortMessageByDateDesc(a, b))
            .map(message => completeMessageData(message, personsById, user))
            .reduce((groups, message, index, messages) => groupMessage(groups, message, index, messages), [])
            .map(group => renderGroupComponent(group, classes))
        
        return <ScrollToBottom 
                    className={classes.messages}
                    followButtonClassName={classes.scrollDownButton}
                    >{renderGroups}
                </ScrollToBottom>

    }

    renderNewMessageForm() {
        const { setMessage, postMessage, messageFormState, classes } = this.props
        
        return (
            <div className={classes.newMessageForm}>
                <InputBase className={classes.input}
                    multiline={true} 
                    fullWidth={true} 
                    value={ messageFormState.content || '' }
                    onChange={ (e) => setMessage(e.target.value) }/>
                <Button onClick={ () => postMessage() }>Ok</Button>
            </div>
        )
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.discussion}>
                { this.renderMessages() }
                { this.renderNewMessageForm() }
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Discussion)    