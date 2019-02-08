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

class Discussion extends Component {

    renderMessagesList() {
        const discussionId = this.props.discussionsState.selected
        const personsById = this.props.personsState.byId
        const user = this.props.userState
        const classes = this.props.classes
        const messagesEntities = this.props.messagesState
        
        const mapIdToMessage = (messagesById, messageId) => messagesById[messageId]
        const filterMessageByDiscussion = (message, discussionId) => message.discussionId == discussionId
        const sortMessageByDateDesc = (a,b) => a.created - b.created
        const mapMessageToComponent = (message, personsById, user) => {
            const hasPerson = typeof personsById[message.creatorId] !== 'undefined'
            let name = 'Unknown'
            let avatarUrl = null
            if (hasPerson) { 
                name = personsById[message.creatorId].name
                avatarUrl = personsById[message.creatorId].avatarUrl
            }
            const fullMessage = Object.assign({}, message, { 
                user: { name, avatarUrl } 
            })
            const alignRight = user.id === message.creatorId            

            return (
                <Card className={classes.card}> 
                    <CardContent className={classes.cardContent}>
                        <List>
                            <Message 
                                key={message.id}
                                message={fullMessage} 
                                alignRight={alignRight}/>                                
                        </List>
                    </CardContent>                
                </Card>                
            )              
        }

        const Messages = messagesEntities.allIds
            .map(messageId => mapIdToMessage(messagesEntities.byId, messageId))
            .filter(message => filterMessageByDiscussion(message, discussionId))
            .sort((a, b) => sortMessageByDateDesc(a, b))
            .map(message => mapMessageToComponent(message, personsById, user))
        
        return <ScrollToBottom className={classes.messages}
                    followButtonClassName={classes.scrollDownButton}
                    >{Messages}</ScrollToBottom>

    }

    renderNewMessageForm() {
        const { setMessage, postMessage, messageFormState } = this.props
        
        return (
            <div className={this.props.classes.newMessageForm}>
                <InputBase className={this.props.classes.input}
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
                { this.renderMessagesList() }
                { this.renderNewMessageForm() }
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Discussion)    