const card = (theme) => ({
    card: {
        margin: 'auto',
        maxWidth: 600,
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing.unit * 3
        }
    },
    cardHeader: {
        paddingBottom: 0,
        padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px`
    },
    cardContent: {
        paddingTop: 0,
    },
})

export default card