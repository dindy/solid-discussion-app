import card from '../../styles/card'
 
const styles = theme => ({
    ...card(theme),
    formControl: {
        margin: theme.spacing.unit,
        width: `calc(100% - ${theme.spacing.unit * 2}px)`,
        minWidth: 120,
    },   
    cardHeader: {
        marginLeft: 8,
        marginRight: 8,
        paddingLeft: 16,
        paddingRight: 16,
        [theme.breakpoints.up('sm')]: {
            paddingRight: 24,
            paddingLeft: 24,
        }
    }         
})

export default styles