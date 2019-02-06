import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './Discussion.styles'
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import CardContent from '@material-ui/core/CardContent'
import Message from './Message'

class Discussion extends Component {

    renderMessagesListItems() {
        const discussionId = this.props.discussionsState.selected
        const persons = this.props.personsState.byId
        const user = this.props.userState

        return this.props.messagesState.allIds
            .map(messageId => this.props.messagesState.byId[messageId])
            .filter(message => message.discussionId == discussionId)
            .sort((a, b) => b.created - a.created)
            .map(message => {
                const name = typeof persons[message.creatorId] !== 'undefined' ? 
                    persons[message.creatorId].name : 'Unknown' 
                
                const avatarUrl = typeof persons[message.creatorId] !== 'undefined' ? 
                    persons[message.creatorId].avatarUrl : null
                
                const fullMessage = Object.assign({}, message, { user: { name, avatarUrl } })
                    
                const alignRight = user.id === message.creatorId

                return <Message 
                    key={message.id}
                    message={fullMessage} 
                    alignRight={alignRight}/>
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