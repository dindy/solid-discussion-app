import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from './AddParticipantForm.styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import classNames from 'classnames'

class AddParticipantForm extends Component {

    render() {

        const { 
            classes, 
            addParticipantCancel, 
            saveAddParticipant,
            discussionsState,
            participantFormState,
            addParticipantWebIdUpdate,            
        } = this.props

        const webId = participantFormState.webId
        const discussionId = discussionsState.selected

        return (
            <Card className={classes.card}>                  
                <CardHeader 
                    className={classes.cardHeader} 
                    title="Add a participant" 
                    subheader="Add a participant to the discussion." />
                <CardContent className={classes.cardContent}>        
                    <form noValidate 
                        autoComplete="off">
                        <FormControl className={classNames(classes.formControl)}>
                            <TextField label="Participant WebId"
                                className={classes.addParticipantField}
                                value={webId || ''}
                                onChange={e => addParticipantWebIdUpdate(e.target.value)}
                                margin="normal"/>  
                        </FormControl>
                    </form>
                </CardContent>
                <CardActions>
                    <Button onClick={() => saveAddParticipant(webId, discussionId)} 
                        color="primary">Add
                    </Button>
                    <Button onClick={addParticipantCancel}>Cancel</Button>
                </CardActions>                
            </Card>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AddParticipantForm)    
