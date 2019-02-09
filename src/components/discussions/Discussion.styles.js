const styles = theme => ({
    discussion: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    messages: {
        height: '50%',
        // overflowY: 'scroll',
        flexGrow: 2,
    },
    card: {
        margin: 'auto',
        maxWidth: 600,
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing.unit,
            marginBottom: theme.spacing.unit
        }
    },
    cardContent: {
    },
    newMessageForm: {
        bottom: 0,
        left: 0,
        width: '100%', 
        backgroundColor: '#fff',
        display: 'flex',
        borderTop: `1px solid ${theme.palette.grey['300']}`,
    },
    input: {
        backgroundColor: '#fff',
    },
    scrollDownButton: {
        display: 'none'
    },
    avatar: {
        margin: 8,
        marginLeft: -16,
    },
    avatarName: {
        margin: 8,
    },  
    listSubheader: {
        display: 'flex',
        paddingBottom: 0,    
    },
    messageItemText: {
        display: 'flex',
        flexDirection: 'column-reverse',
        padding: 0,
        paddingLeft: 8,
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: {
            paddingLeft: 24,
        }
    },            
})

export default styles