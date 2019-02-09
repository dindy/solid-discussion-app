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

        return (
            <ListItem
                className={classNames(
                    classes.listItem, 
                    classes.listItemTextWithoutAvatar,
                    // alignRight ? classes.listItemRight : null,
                    // alignRight && !displayMeta ? classes.listItemTextRightWithoutAvatar : null, 
                    // !alignRight && !displayMeta ? classes.listItemTextWithoutAvatar: null, 
                    )}>      


                <ListItemText 
                    className={classes.messageItemText}
                    primary={message.content}/>

            </ListItem>
        )
    }
}    

export default withStyles(styles, { withTheme: true })(Message)      