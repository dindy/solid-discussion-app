import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LeftDrawer from './components/LeftDrawer'
import DiscussionDrawer from './components/DiscussionDrawer'
import AppBarWrapper from './components/AppBarWrapper'
import styles from './App.styles'
import Main from "./components/Main"
import SnackbarNotifications from "./components/SnackbarNotifications"
import Explorer from "./components/Explorer"
import { connect } from 'react-redux'
import * as layoutActions from './actions/layout'
import * as userActions from './actions/user'
import * as discussionsActions from './actions/discussions';
import * as explorerActions from './actions/explorer';

class App extends Component {
    
    componentWillMount() {
        
        // Recover solid auth session
        this.props.recoverSession()

        // Parse URL to load discussion if any
        const discussionURI = this.getDiscussionParameter()
        if (discussionURI !== null) {
            this.props.openDiscussion(discussionURI)
            this.props.selectDiscussion(discussionURI)
        }
        
        // Handle responsive
        if (window.matchMedia(`(min-width: ${this.props.theme.breakpoints.values.md}px)`).matches) {
            this.props.openLeftDrawer()
        }
    }

    getDiscussionParameter() {
        const urlString = window.location.href
        const url = new URL(urlString)
        return url.searchParams.get("discussion")        
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
                    selectDiscussion={this.props.selectDiscussion} 
                    />                 
                <Main 
                    layoutState={this.props.layoutState} 
                    discussionsState={this.props.discussionsState} 
                    messagesState={this.props.messagesState} 
                    personsState={this.props.personsState} 
                    discussionFormState={this.props.discussionFormState} 
                    userState={this.props.userState} 
                    newDiscussion={this.props.newDiscussion} 
                    changeNewDiscussionStorage={this.props.changeNewDiscussionStorage} 
                    login={this.props.login}                    
                    openExplorer={this.props.openExplorer} 
                    changeNewDiscussionName={this.props.changeNewDiscussionName}
                    changeNewDiscussionPath={this.props.changeNewDiscussionPath}                    
                    changeNewDiscussionAddPrivateIndex={this.props.changeNewDiscussionAddPrivateIndex}                    
                    cancelNewDiscussion={this.props.cancelNewDiscussion} 
                    createNewDiscussion={this.props.createNewDiscussion} 
                    />
                <DiscussionDrawer 
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
    selectDiscussion: url => dispatch(discussionsActions.selectDiscussion(url)),
    cancelNewDiscussion: () => dispatch(discussionsActions.cancelNewDiscussion()),
    changeNewDiscussionStorage: storage => dispatch(discussionsActions.changeNewDiscussionStorage(storage)),
    changeNewDiscussionName: name => dispatch(discussionsActions.changeNewDiscussionName(name)),
    changeNewDiscussionPath: path => dispatch(discussionsActions.changeNewDiscussionPath(path)),
    changeNewDiscussionAddPrivateIndex: added => dispatch(discussionsActions.changeNewDiscussionAddPrivateIndex(added)),
    createNewDiscussion: () => dispatch(discussionsActions.createNewDiscussion()),
    openExplorer: (rootUrl, storageUrl) => dispatch(explorerActions.openExplorer(rootUrl, storageUrl)),
    exploreFolder: rootUrl => dispatch(explorerActions.exploreFolder(rootUrl)),
    selectFolder: url => dispatch(explorerActions.selectFolder(url)),
    exploreParentFolder: () => dispatch(explorerActions.exploreParentFolder()),
    closeExplorer: () => dispatch(layoutActions.closeExplorer()),
    openLeftDrawer: () => dispatch(layoutActions.openLeftDrawer()),
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
    personsState: state.entities.persons,
    participantsState: state.entities.participants,
    messagesState: state.entities.messages,
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
