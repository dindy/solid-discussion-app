import React, { Component } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

class Main extends Component {

    state = {
        open: false,
        anchor: 'left',
    };

    render() {
        
        const { classes } = this.props
        const state = this.state

        return (
            <main
                className={classNames(classes.content, classes[`content-right`], {
                    [classes.contentShift]: state.open,
                    [classes[`contentShift-right`]]: state.open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Typography>{'Bienvenue'}</Typography>
            </main>
            
        )
    }
}

export default Main