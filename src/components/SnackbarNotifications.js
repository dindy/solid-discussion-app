import React, { Component } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import styles from './SnackbarNotifications.styles'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

class SnackbarNotifications extends Component {
  
    TransitionUp(props) {
        return <Slide {...props} direction="up" />;
    }

    render() {
        const { layoutState, classes, closeSnackbar, exitedSnackbarCallback } = this.props
        const { message, key } = layoutState.snackbar.messageInfo

        return (
            <div>
                <Snackbar
                    key={key}
                    open={layoutState.snackbar.open}
                    onClose={closeSnackbar}
                    onExited={exitedSnackbarCallback}
                    TransitionComponent={this.TransitionUp}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{message}</span>}
                    action={[<IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={closeSnackbar}
                    >
                        <CloseIcon />
                    </IconButton>,
                    ]}
                />                
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(SnackbarNotifications)