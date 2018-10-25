import React, { Component } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import styles from './Main.styles'
import AddIcon from '@material-ui/icons/Add'
import NewDiscussionForm from './NewDiscussionForm'
import Discussion from './Discussion'
import LinearProgress from '@material-ui/core/LinearProgress'
import Slide from '@material-ui/core/Slide'
import AddParticipantForm from './AddParticipantForm';

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
        const classes = this.props.classes

        return userStateLoading || discussionsStateLoading ? 
            <LinearProgress className={classes.progressBar}/> 
            : null
    }
        
    renderNewDiscussionButton() {
        const authenticated = this.props.userState.authenticated 
        const newDiscussionFormOpen = this.props.layoutState.newDiscussionForm.open
        const classes = this.props.classes
        const newDiscussion = this.props.newDiscussion

        return authenticated && !newDiscussionFormOpen ? (
            <Button variant="fab" className={classes.fab} color='primary' onClick={newDiscussion}>
                <AddIcon />
            </Button>                           
        ) : null
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
                    createNewDiscussion={this.props.createNewDiscussion}
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
                    />
            </Slide>            
        )
    }

    renderDiscussion() {
        const selectedDiscussion = this.props.discussionsState.selected

        return selectedDiscussion !== null ? (
            <Discussion 
                discussionsState={this.props.discussionsState}
                messagesState={this.props.messagesState}
                personsState={this.props.personsState}
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
                { this.renderNewDiscussionButton() } 
                { this.renderNewDiscussionForm() }
                { this.renderAddParticipantForm() }
                { this.renderDiscussion() }
            </main>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Main)