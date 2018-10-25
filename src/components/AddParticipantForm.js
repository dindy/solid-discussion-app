import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from './AddParticipantForm.styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

class AddParticipantForm extends Component {

    render() {

        const { classes } = this.props

        return (
            <Card className={classes.card}>                  
                <CardHeader 
                    className={classes.cardHeader} 
                    title="New discussion" 
                    subheader="Create a new discussion on your pod." 
                    />
                <CardContent className={classes.cardContent}>        
                <form 
                    noValidate 
                    autoComplete="off">
                    <FormControl 
                        >
                        <TextField
                            label="Participant WebId"
                            className={classes.addParticipantField}
                            value={''}
                            margin="normal"   
                            />  
                        <Button>Add</Button>
                        <Button>Cancel</Button>
                    </FormControl>
                </form>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AddParticipantForm)    
