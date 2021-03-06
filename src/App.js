import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LeftDrawer from './components/layout/LeftDrawer'
import DiscussionDrawer from './components/layout/DiscussionDrawer'
import AppBarWrapper from './components/layout/AppBarWrapper'
import styles from './App.styles'
import Main from "./components/Main"
import SnackbarNotifications from "./components/layout/SnackbarNotifications"
import Explorer from "./components/explorer/Explorer"
import { connect } from 'react-redux'
import * as layoutActions from './actions/layout'
import * as userActions from './actions/user'
import * as discussionsActions from './actions/discussions'
import * as explorerActions from './actions/explorer'

class App extends Component {
    
    componentWillMount() {
        
        // Recover solid auth session (can be an outdated session resulting in 401 when fetching profile)
        this.props.recoverSession()

        // Parse URL to load discussion if any
        const discussionURI = this.getParameterFromUrl('discussion')
        if (discussionURI !== null) {
            this.props.openDiscussion(discussionURI)
        }
        
        // Handle responsive
        if (window.matchMedia(`(min-width: ${this.props.theme.breakpoints.values.md}px)`).matches) {
            this.props.openLeftDrawer()
        }
    }

    /**
    * Search for the value of the given key in URL parameters
    * @param {string} The key to look for
    * @returns {string|null} New object with merged key/values
    */
    getParameterFromUrl(key) {
        const urlString = window.location.href
        const url = new URL(urlString)
        return url.searchParams.get(key)       
    }

    render() {

        const { classes } = this.props

        return (
            <div className={classes.appFrame}>
                <AppBarWrapper 
                    toggleLeftDrawer={this.props.toggleLeftDrawer}
                    toggleDiscussionDrawer={this.props.toggleDiscussionDrawer} 
                    layoutState={this.props.layoutState} 
                    discussionsState={this.props.discussionsState} 
                    />
                <LeftDrawer 
                    toggleLeftDrawer={this.props.toggleLeftDrawer}
                    layoutState={this.props.layoutState} 
                    userState={this.props.userState} 
                    personsState={this.props.personsState} 
                    discussionsState={this.props.discussionsState} 
                    openDiscussion={this.props.openDiscussion} 
                    newDiscussion={this.props.newDiscussion} 
                    />                 
                <Main 
                    layoutState={this.props.layoutState} 
                    discussionsState={this.props.discussionsState} 
                    messagesState={this.props.messagesState} 
                    personsState={this.props.personsState} 
                    discussionFormState={this.props.discussionFormState} 
                    userState={this.props.userState} 
                    changeNewDiscussionStorage={this.props.changeNewDiscussionStorage} 
                    login={this.props.login}                    
                    openExplorer={this.props.openExplorer} 
                    changeNewDiscussionName={this.props.changeNewDiscussionName}
                    changeNewDiscussionPath={this.props.changeNewDiscussionPath}                    
                    changeNewDiscussionAddPrivateIndex={this.props.changeNewDiscussionAddPrivateIndex}                    
                    cancelNewDiscussion={this.props.cancelNewDiscussion} 
                    saveNewDiscussion={this.props.saveNewDiscussion} 
                    addParticipantCancel={this.props.addParticipantCancel} 
                    saveAddParticipant={this.props.saveAddParticipant} 
                    participantFormState={this.props.participantFormState} 
                    addParticipantWebIdUpdate={this.props.addParticipantWebIdUpdate} 
                    postMessage={this.props.postMessage} 
                    setMessage={this.props.setMessage} 
                    messageFormState={this.props.messageFormState} 
                    />
                <DiscussionDrawer 
                    addParticipant={this.props.addParticipant} 
                    layoutState={this.props.layoutState} 
                    userState={this.props.userState} 
                    personsState={this.props.personsState} 
                    discussionsState={this.props.discussionsState} 
                    toggleDiscussionDrawer={this.props.toggleDiscussionDrawer} 
                    participantsState={this.props.participantsState} 
                    />                       
                <SnackbarNotifications
                    layoutState={this.props.layoutState} 
                    closeSnackbar={this.props.closeSnackbar} 
                    exitedSnackbarCallback={this.props.exitedSnackbarCallback} 
                    />
                <Explorer 
                    layoutState={this.props.layoutState} 
                    explorerState={this.props.explorerState} 
                    exploreFolder={this.props.exploreFolder} 
                    closeExplorer={this.props.closeExplorer} 
                    exploreParentFolder={this.props.exploreParentFolder} 
                    selectFolder={this.props.selectFolder} 
                    />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    toggleLeftDrawer: () => dispatch(layoutActions.toggleLeftDrawer()),
    toggleDiscussionDrawer: () => dispatch(layoutActions.toggleDiscussionDrawer()),
    closeSnackbar: () => dispatch(layoutActions.closeSnackbar()),
    exitedSnackbarCallback: () => dispatch(layoutActions.exitedSnackbarCallback()),
    login: () => dispatch(userActions.login()),
    recoverSession: () => dispatch(userActions.recoverSession()),
    newDiscussion: () => dispatch(discussionsActions.newDiscussion()),
    openDiscussion: url => dispatch(discussionsActions.openDiscussion(url)),
    cancelNewDiscussion: () => dispatch(discussionsActions.cancelNewDiscussion()),
    changeNewDiscussionStorage: storage => dispatch(discussionsActions.changeNewDiscussionStorage(storage)),
    changeNewDiscussionName: name => dispatch(discussionsActions.changeNewDiscussionName(name)),
    changeNewDiscussionPath: path => dispatch(discussionsActions.changeNewDiscussionPath(path)),
    changeNewDiscussionAddPrivateIndex: added => dispatch(discussionsActions.changeNewDiscussionAddPrivateIndex(added)),
    saveNewDiscussion: () => dispatch(discussionsActions.saveNewDiscussion()),
    openExplorer: (rootUrl, storageUrl) => dispatch(explorerActions.openExplorer(rootUrl, storageUrl)),
    exploreFolder: rootUrl => dispatch(explorerActions.exploreFolder(rootUrl)),
    selectFolder: url => dispatch(explorerActions.selectFolder(url)),
    exploreParentFolder: () => dispatch(explorerActions.exploreParentFolder()),
    closeExplorer: () => dispatch(layoutActions.closeExplorer()),
    openLeftDrawer: () => dispatch(layoutActions.openLeftDrawer()),
    addParticipant: () => dispatch(discussionsActions.addParticipant()),
    addParticipantCancel: () => dispatch(discussionsActions.addParticipantCancel()),
    saveAddParticipant: (discussionId, webId) => dispatch(discussionsActions.saveAddParticipant(discussionId, webId)),
    addParticipantWebIdUpdate: (webId) => dispatch(discussionsActions.addParticipantWebIdUpdate(webId)),
    postMessage: () => dispatch(discussionsActions.postMessage()),
    setMessage: (content) => dispatch(discussionsActions.setMessage(content)),
})

const mapStateToProps = state => ({
    layoutState: state.layout,
    userState: state.user,
    explorerState: state.explorer,
    discussionsState: {
        ...state.discussions,
        entities: state.entities.discussions,
    },
    discussionFormState: state.discussionForm,
    participantFormState: state.participantForm,
    personsState: state.entities.persons,
    participantsState: state.entities.participants,
    messagesState: state.entities.messages,
    messageFormState: state.messageForm,
})

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
                    withStyles(styles, { withTheme: true })(
                        App
                    )
                )
