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

class Discussion extends Component {

    renderMessagesList() {
        const discussionId = this.props.discussionsState.selected
        const personsIds = this.props.personsState.byId
        const user = this.props.userState
        const messagesEntities = this.props.messagesState
        
        const Messages = messagesEntities.allIds
            .map(messageId => messagesEntities.byId[messageId])
            .filter(message => message.discussionId == discussionId)
            .sort((a, b) => b.created - a.created)
            .map(message => {
                const name = typeof personsIds[message.creatorId] !== 'undefined' ? 
                    personsIds[message.creatorId].name : 'Unknown' 
                
                const avatarUrl = typeof personsIds[message.creatorId] !== 'undefined' ? 
                    personsIds[message.creatorId].avatarUrl : null
                
                const fullMessage = Object.assign({}, message, { user: { name, avatarUrl } })
                    
                const alignRight = user.id === message.creatorId

                return <Message 
                    key={message.id}
                    message={fullMessage} 
                    alignRight={alignRight}/>
            })
        
            return <List>{Messages}</List>
    }

    renderNewMessageForm() {
        return (
            <div className={this.props.classes.newMessageForm}>
                <InputBase className={this.props.classes.input}
                    multiline={true} 
                    fullWidth={true} 
                    rows={2}/>
                <Button>Ok</Button>
            </div>
        )
    }

    render() {
        const { classes } = this.props

        return (
            <Card className={classes.card}> 
                <CardContent className={classes.cardContent}>
                    { this.renderMessagesList() }
                </CardContent>                
                { this.renderNewMessageForm() }
            </Card>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Discussion)    