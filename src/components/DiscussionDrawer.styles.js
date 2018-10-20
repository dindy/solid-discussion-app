import { drawerWidth } from '../styles/variables'

const styles = theme => ({
    drawerPaper: {
        width: drawerWidth * 2,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    title: {
        padding: 8
    },        
})

export default styles