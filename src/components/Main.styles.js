import { drawerWidth } from '../styles/variables'

const styles = theme => ({
    content: {    
        maxHeight: 'calc( 100vh - 64px )',
        position: 'relative',
        paddingTop: 64, // menu height
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        // padding: theme.spacing.unit,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    progressBar: {
        position: 'absolute',
        width: '100%',
        top: 56,
        left: 0,
        [theme.breakpoints.up('sm')]: {
            top: 64,
        }
    },
    'content-left': {
        marginLeft: -drawerWidth,
    },
    'content-right': {
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
    },
    'contentShift-right': {
        marginRight: 0,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },     
})

export default styles