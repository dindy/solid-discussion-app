import React, { Component } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

class Main extends Component {


    render() {
        
        const { classes, layoutState } = this.props

        return (
            <main
                className={classNames(classes.content, classes[`content-left`], {
                    [classes.contentShift]: layoutState.leftDrawer.open,
                    [classes[`contentShift-left`]]: layoutState.leftDrawer.open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Typography>{'Bienvenue'}</Typography>
            </main>
            
        )
    }
}

export default Main