import { drawerWidth } from '../../styles/variables'

const styles = theme => ({
    appFrame: {
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'appBarShift-left': {
        marginLeft: drawerWidth,
    },
    'appBarShift-right': {
        marginRight: drawerWidth,
    },
    toolBar: {
        justifyContent: 'space-between',
        paddingRight: 0,
        paddingLeft: 0,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    discussionSettingsButtonWrapper: {
        flexGrow: 1,
    },
    discussionSettingsButton: {
        marginLeft: 12,
        marginRight: 20,
        float: 'right',
    },
    hide: {
        display: 'none',
    },
})

export default styles
