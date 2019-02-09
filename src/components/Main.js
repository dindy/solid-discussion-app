import React, { Component } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import styles from './Main.styles'
import NewDiscussionForm from './discussions/NewDiscussionForm'
import Discussion from './discussions/Discussion'
import LinearProgress from '@material-ui/core/LinearProgress'
import Slide from '@material-ui/core/Slide'
import AddParticipantForm from './participants/AddParticipantForm';

class Main extends Component {

    renderLoginButton() {
        const authenticated = this.props.userState.authenticated
        const login = this.props.login

        return !authenticated ? 
            <Button variant="outlined" color="primary" onClick={login}>Log in with Solid</Button>
            : null
    }

    renderLoader() {
        const userStateLoading = this.props.userState.loading
        const discussionsStateLoading = this.props.discussionsState.loading
        const discussionFormStateSaving = this.props.discussionFormState.saving
        const classes = this.props.classes
        return userStateLoading || discussionsStateLoading || discussionFormStateSaving ? 
            <LinearProgress className={classes.progressBar}/> 
            : null
    }
    
    renderNewDiscussionForm() {
        return (
            <Slide 
                direction="up" 
                in={this.props.layoutState.newDiscussionForm.open} 
                mountOnEnter 
                unmountOnExit
                >
                <NewDiscussionForm 
                    userState={this.props.userState} 
                    changeNewDiscussionStorage={this.props.changeNewDiscussionStorage}
                    openExplorer={this.props.openExplorer}
                    discussionFormState={this.props.discussionFormState}
                    changeNewDiscussionName={this.props.changeNewDiscussionName}
                    changeNewDiscussionPath={this.props.changeNewDiscussionPath}
                    changeNewDiscussionAddPrivateIndex={this.props.changeNewDiscussionAddPrivateIndex}
                    cancelNewDiscussion={this.props.cancelNewDiscussion}
                    saveNewDiscussion={this.props.saveNewDiscussion}
                    />
            </Slide>
        )        
    }
    
    renderAddParticipantForm() {
        return (
            <Slide 
                direction="up" 
                in={this.props.layoutState.addParticipantForm.open} 
                mountOnEnter 
                unmountOnExit
                >
                <AddParticipantForm 
                    addParticipantCancel={this.props.addParticipantCancel}
                    saveAddParticipant={this.props.saveAddParticipant}
                    discussionsState={this.props.discussionsState}
                    participantFormState={this.props.participantFormState}
                    addParticipantWebIdUpdate={this.props.addParticipantWebIdUpdate}                
                    />
            </Slide>            
        )
    }

    renderDiscussion() {
        const selectedDiscussion = this.props.discussionsState.selected
        const isOpen = this.props.layoutState.discussion.open

        return isOpen ? (
            <Discussion 
                discussionsState={this.props.discussionsState}
                messagesState={this.props.messagesState}
                personsState={this.props.personsState}
                userState={this.props.userState}
                postMessage={this.props.postMessage} 
                setMessage={this.props.setMessage} 
                messageFormState={this.props.messageFormState} 
            />
        ) : null
    }

    render() {
        
        const { 
            classes, 
            layoutState, 
        } = this.props

        return (
            <main
                className={classNames(classes.content, classes[`content-left`], {
                    [classes.contentShift]: layoutState.leftDrawer.open,
                    [classes[`contentShift-left`]]: layoutState.leftDrawer.open,
                })}
                >
                { this.renderLoader() }
                { this.renderLoginButton() } 
                { this.renderNewDiscussionForm() }
                { this.renderAddParticipantForm() }
                { this.renderDiscussion() }
            </main>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Main)