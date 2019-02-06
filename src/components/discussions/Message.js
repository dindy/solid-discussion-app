import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './Message.styles'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import { ListItem } from '@material-ui/core'

class Message extends Component {
    
    render() {
        
        const { message, classes, alignRight } = this.props
        
        return (
            <ListItem
                className={classNames(classes.listItem, alignRight ? classes.listItemRight : null)}>
                
                <Avatar alt={message.user.name}
                    src={message.user.avatarUrl}
                    className={classes.avatar}/>
                
                <ListItemText className={classes.messageItemText}
                    primary={message.content} 
                    secondary={
                        <span className={classes.messageMeta}>
                            {message.user.name + ', ' + message.created.toISOString()}
                        </span>
                    } />

            </ListItem>
        )
    }
}    

export default withStyles(styles, { withTheme: true })(Message)      