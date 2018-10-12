import React, { Component } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import styles from './Main.styles'
import AddIcon from '@material-ui/icons/Add'
import NewDiscussionForm from './NewDiscussionForm'
import LinearProgress from '@material-ui/core/LinearProgress'
import Slide from '@material-ui/core/Slide'

class Main extends Component {

    render() {
        
        const { classes, 
            layoutState, 
            login, 
            userState, 
            discussionsState,
            discussionFormState,
            newDiscussion, 
            changeNewDiscussionStorage, 
            openExplorer,
            changeNewDiscussionName,
            changeNewDiscussionPath,      
            changeNewDiscussionAddPrivateIndex,     
            cancelNewDiscussion,
            createNewDiscussion,
        } = this.props
        
        const loginButton = () => {
            return !userState.authenticated ? ( 
                <Button variant="outlined" color="primary" onClick={login}>Log in with Solid</Button>
            ) : null
        }
            
        const newDiscussionButton = () => {
            return userState.authenticated && !layoutState.newDiscussionForm.open ? (
                <Button variant="fab" className={classes.fab} color='primary' onClick={newDiscussion}>
                    <AddIcon />
                </Button>                           
            ) : null
        }

        const loader = () => userState.loading ? <LinearProgress className={classes.progressBar}/> : null

        const newDiscussionForm = () => {
            return (
                <Slide direction="up" in={layoutState.newDiscussionForm.open} mountOnEnter unmountOnExit>
                    <NewDiscussionForm 
                        userState={userState} 
                        changeNewDiscussionStorage={changeNewDiscussionStorage}
                        openExplorer={openExplorer}
                        discussionFormState={discussionFormState}
                        changeNewDiscussionName={changeNewDiscussionName}
                        changeNewDiscussionPath={changeNewDiscussionPath}
                        changeNewDiscussionAddPrivateIndex={changeNewDiscussionAddPrivateIndex}
                        cancelNewDiscussion={cancelNewDiscussion}
                        createNewDiscussion={createNewDiscussion}
                    />
                </Slide>
            )
        }

        return (
            <main
                className={classNames(classes.content, classes[`content-left`], {
                    [classes.contentShift]: layoutState.leftDrawer.open,
                    [classes[`contentShift-left`]]: layoutState.leftDrawer.open,
                })}
            >
                { loader() }

                { loginButton() }
                { newDiscussionButton() } 
                { newDiscussionForm() }
            </main>
            
        )
    }
}

export default withStyles(styles, { withTheme: true })(Main)