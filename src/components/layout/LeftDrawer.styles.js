import { drawerWidth } from '../../styles/variables'

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: `0 ${2 * theme.spacing.unit}px`,
        ...theme.mixins.toolbar,
        [theme.breakpoints.up('sm')]: {
            paddingLeft: 3 * theme.spacing.unit,
            paddingRight: 3 * theme.spacing.unit,
        },        
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
        margin: `${theme.spacing.unit}px auto`,
    },
    bigAvatar: {
        width: theme.spacing.unit * 7,
        height: theme.spacing.unit * 7,
    },  
    avatarName: {
        margin: `${theme.spacing.unit}px 0`,
    },
    listSubheader: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: `${theme.spacing.unit}px 0`,
    },
})

export default styles
