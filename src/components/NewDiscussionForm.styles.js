import card from '../styles/card'
 
const styles = theme => ({
    ...card(theme),
    container: {
    
    },
    textField: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
    },  
    nameTextField: {
        // minWidth: 250
    },
    select: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit
    },
    formControl: {
        margin: theme.spacing.unit,
        width: `calc(100% - ${theme.spacing.unit * 2}px)`,
        minWidth: 120,
    },    
    selectWrapper: {
        position: 'relative',
        marginTop: theme.spacing.unit * 2,
    },
    checkbox: {
        
    },
    changeFolderControl: {
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    changeFolderButton: {
        verticalAlign: 'baseline',
        padding: '6px 8px',
        marginBottom: theme.spacing.unit
    },
    changePathControl: {
    },
    info: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: theme.spacing.unit, 
        margin: theme.spacing.unit, 
        color: `${theme.palette.grey['300']}`,
        border: `${theme.palette.grey['300']} 1px solid`,  
        maxWidth: 'calc(100vw - 83px)',  
    },
    infoIcon: {
        marginRight: theme.spacing.unit,

    },
    infoText: {
        flexGrow: 1,
        overflowWrap: 'break-word',
        overflow: 'hidden'
    },
    infoTextUrl: {
        fontWeight: 'bold'
    },
})

export default styles