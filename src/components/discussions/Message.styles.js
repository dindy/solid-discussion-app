const styles = theme => ({
    listItem: {
        display: 'flex',
        paddingBottom: 0,
        padding: '0 24px'

    },
    listItemRight: {
        flexDirection: 'row-reverse',
        textAlign: 'right',
    },
    listItemTextRightWithoutAvatar: {
        paddingRight: 40 + 16,
        [theme.breakpoints.up('sm')]: {
            paddingRight: 40 + 24 + 16,
        }
    },    
    listItemTextWithoutAvatar: {
        paddingLeft: 40 + 16,
        [theme.breakpoints.up('sm')]: {
            paddingLeft: 40 + 24 + 16,
        }
    },      
    messageItemText: {
    },
})

export default styles