import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar'
import classNames from 'classnames';

const styles = {
    row: {
      display: 'flex',
      justifyContent: 'center',
    },
    avatar: {
      margin: 10,
    },
    bigAvatar: {
      width: 60,
      height: 60,
    },
  };

class LeftDrawer extends Component {

    handleDrawerToggle = () => this.props.toggleLeftDrawer()

    render() {

        const { classes, theme, layoutState, userState } = this.props
        const renderUserData = () => {
            return (
                <div>
                    <Avatar
                        alt={userState.name}
                        src={userState.avatarUrl}
                        className={classNames(classes.avatar, classes.bigAvatar)}
                    />  
                    <Typography className={classes.avatarName} variant="body2" color="textPrimary">
                        {userState.name}
                    </Typography>                                      
                </div>
            )
        }

        return (
            <Drawer
                variant="persistent"
                anchor='left'
                open={layoutState.leftDrawer.open}
                classes={{paper: classes.drawerPaper,}}
            >
                <div className={classes.drawerHeader}>
                    {renderUserData()}
                    <IconButton className={classes.drawerHeaderIconButton} onClick={this.handleDrawerToggle}>
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