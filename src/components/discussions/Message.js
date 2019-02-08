import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './Message.styles'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import { ListItem } from '@material-ui/core'

class Message extends Component {
    
    render() {
        
        const { message, classes, alignRight, displayMeta } = this.props
        const displayAvatar = (display, message, classes) => !display ? (
            <div className={classes.avatarBlank}></div>
        ) : (
            <Avatar alt={message.user.name}
                src={message.user.avatarUrl}
                className={classes.avatar}/>
        )
        return (
            <ListItem
                className={classNames(
                    classes.listItem, 
                    !displayMeta ? classes.listItemTextWithoutAvatar : null,
                    // alignRight ? classes.listItemRight : null,
                    // alignRight && !displayMeta ? classes.listItemTextRightWithoutAvatar : null, 
                    // !alignRight && !displayMeta ? classes.listItemTextWithoutAvatar: null, 
                    )}>      

                {displayAvatar(displayMeta, message, classes)}

                <ListItemText className={classes.messageItemText}
                    primary={message.content} 
                    secondary={!displayMeta ? ' ' : 
                        <span className={classes.messageMeta}>
                            {message.user.name + ', ' + message.created.toISOString()}
                        </span>
                    } />

            </ListItem>
        )
    }
}    

export default withStyles(styles, { withTheme: true })(Message)      