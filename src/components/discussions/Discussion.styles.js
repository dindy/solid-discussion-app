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
    }    
})

export default styles