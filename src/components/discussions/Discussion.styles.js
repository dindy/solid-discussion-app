const styles = theme => ({
    card: {
        margin: 'auto',
        maxWidth: 600,
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing.unit * 3
        }
    },
    cardContent: {
    },
    newMessageForm: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%', 
        backgroundColor: '#fff',
        display: 'flex',
        borderTop: `1px solid ${theme.palette.grey['300']}`,
    },
    input: {
        backgroundColor: '#fff',
    }
})

export default styles