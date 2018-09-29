import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import LeftDrawer from './components/LeftDrawer'
import AppBarWrapper from './components/AppBarWrapper'
import styles from './styles'
import Main from "./components/Main"
import { connect } from 'react-redux'
import * as layoutActions from './actions/layout'

class App extends Component {

    render() {

        const { classes, theme } = this.props

        return (
            <div className={classes.appFrame}>
                <AppBarWrapper 
                    classes={classes} 
                    theme={theme} 
                    toggleLeftDrawer={this.props.toggleLeftDrawer}
                    layoutState={this.props.layoutState} 
                />
                <LeftDrawer 
                    classes={classes} 
                    theme={theme} 
                    toggleLeftDrawer={this.props.toggleLeftDrawer}
                    layoutState={this.props.layoutState} 
                />
                <Main 
                    classes={classes} 
                    theme={theme}
                    layoutState={this.props.layoutState} 
                />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    toggleLeftDrawer: () => dispatch(layoutActions.toggleLeftDrawer())
})

const mapStateToProps = state => ({
    layoutState: state.layout
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
