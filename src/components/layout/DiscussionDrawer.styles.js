import { drawerWidth } from '../../styles/variables'

const styles = theme => ({
    drawerPaper: {
        // maxWidth: `calc(100vw - ${drawerWidth * 2 + theme.spacing.unit}px)`,
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: `0 ${theme.spacing.unit}px`,
        ...theme.mixins.toolbar,
    },
    title: {
        padding: theme.spacing.unit
    },      
    avatar: {
        margin: theme.spacing.unit,
    },
    mediumAvatar: {
        width: theme.spacing.unit * 5,
        height: theme.spacing.unit * 5,
    },  
    avatarName: {
        margin: theme.spacing.unit,
    },  
    listSubheader: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: `${theme.spacing.unit}px 0`,
    },        
})

export default styles