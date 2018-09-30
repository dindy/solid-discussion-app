import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LeftDrawer from './components/LeftDrawer'
import AppBarWrapper from './components/AppBarWrapper'
import styles from './App.styles'
import Main from "./components/Main"
import { connect } from 'react-redux'
import * as layoutActions from './actions/layout'
import * as userActions from './actions/user'

class App extends Component {

    componentDidMount() {
        this.props.recoverSession()
    }

    render() {

        const { classes, theme } = this.props

        return (
            <div className={classes.appFrame}>
                <AppBarWrapper 
                    toggleLeftDrawer={this.props.toggleLeftDrawer}
                    layoutState={this.props.layoutState} 
                />
                <LeftDrawer 
                    toggleLeftDrawer={this.props.toggleLeftDrawer}
                    layoutState={this.props.layoutState} 
                    userState={this.props.userState} 
                />
                <Main 
                    layoutState={this.props.layoutState} 
                    userState={this.props.userState} 
                    login={this.props.login}                    
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    toggleLeftDrawer: () => dispatch(layoutActions.toggleLeftDrawer()),
    login: () => dispatch(userActions.login()),
    recoverSession: () => dispatch(userActions.recoverSession()),
})

const mapStateToProps = state => ({
    layoutState: state.layout,
    userState: state.user,
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
