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
    listItem: {
        alignItems: 'start',
    },
    avatar: {
        margin: 10,
    },
    avatarName: {
        margin: 10,
    },    
    messageMeta: {

    },
    messageItemText: {
        display: 'flex',
        flexDirection: 'column-reverse',
    }
})

export default styles