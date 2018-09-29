import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListSubheader from '@material-ui/core/ListSubheader';

class LeftDrawer extends Component {

    handleDrawerToggle = () => this.props.toggleLeftDrawer()

    render() {

        const { classes, theme, layoutState } = this.props
        
        return (
            <Drawer
                variant="persistent"
                anchor='left'
                open={layoutState.leftDrawer.open}
                classes={{paper: classes.drawerPaper,}}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.handleDrawerToggle}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <ListSubheader>Discussions</ListSubheader>
                <List>
                    
                </List>
            </Drawer>  
        )
    }
}
    
export default LeftDrawer;            