const styles = theme => ({
    listItem: {
        display: 'flex',
        paddingBottom: 0,
    },
    listItemRight: {
        flexDirection: 'row-reverse',
        textAlign: 'right',
    },
    listItemTextRightWithoutAvatar: {
        paddingRight: 40 + 16 + 16,
        [theme.breakpoints.up('sm')]: {
            paddingRight: 40 + 24 + 16,
        }
    },    
    listItemTextWithoutAvatar: {
        paddingLeft: 40 + 16 + 16,
        [theme.breakpoints.up('sm')]: {
            paddingLeft: 40 + 24 + 16,
        }
    },    
    avatar: {
        margin: 8,
    },
    avatarName: {
        margin: 8,
    },    
    messageMeta: {

    },
    messageItemText: {
        display: 'flex',
        flexDirection: 'column-reverse',
    },
})

export default styles