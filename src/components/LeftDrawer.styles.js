import { drawerWidth } from '../styles/variables'

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    drawerHeaderIconButton: {
        marginTop: theme.spacing.unit
    },    
    bubbleIcon: {
        marginRight: theme.spacing.unit
    },

    // Avatars
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    avatar: {
        margin: theme.spacing.unit,
    },
    bigAvatar: {
        width: theme.spacing.unit * 7,
        height: theme.spacing.unit * 7,
    },  
    avatarName: {
        margin: theme.spacing.unit,
    },
})

export default styles
