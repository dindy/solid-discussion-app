import React, { Component } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import styles from './NewDiscussionForm.styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import FolderIcon from '@material-ui/icons/Folder'
import InfoIcon from '@material-ui/icons/Info'
import { Typography } from '@material-ui/core';

class NewDiscussionForm extends Component {

    changeName = e => this.props.changeNewDiscussionName(e.target.value)
    
    changePath = e => this.props.changeNewDiscussionPath(e.target.value)
    
    changeFolderName = e => this.props.changeFolderName(e.target.value)

    changeStorage = e => this.props.changeNewDiscussionStorage(e.target.value)
    
    changeAddToPrivateIndex = e => this.props.changeNewDiscussionAddPrivateIndex(e.target.checked)

    selectFolder = e => {
        const newDiscussion = this.props.discussionsState.newDiscussion
        const storageUrl = (newDiscussion.storageUrl == null) ? 
            this.props.userState.storages[0] : 
            newDiscussion.storageUrl 
        const url = this.props.discussionsState.newDiscussion.path == null ?
            storageUrl :
            this.props.discussionsState.newDiscussion.path
        this.props.openExplorer(url, storageUrl) 
    }

    componentDidMount() {
        this.props.changeNewDiscussionStorage(this.props.userState.storages[0])
    }

    render() {

        const { classes, 
            userState, 
            discussionsState, 
            cancelNewDiscussion, 
            createNewDiscussion 
        } = this.props

        const { newDiscussion } = discussionsState
        
        const inputProps = {
            endAdornment: 
            <InputAdornment position="end">
                <IconButton
                    aria-label="Select folder"
                    onClick={this.selectFolder}
                    >
                    <FolderIcon />
                </IconButton>
            </InputAdornment>
        }  
        
        const getRelativePath = () => {
            if (newDiscussion.path == null) return '/'
            console.log(newDiscussion)
            return '/' + newDiscussion.path.replace(newDiscussion.storageUrl, '')
        }
        
        const getFinalPath = () => {
            const newDiscussion = this.props.discussionsState.newDiscussion 
            if (newDiscussion.path == null)
                return newDiscussion.storageUrl + newDiscussion.folderName + '/'
            return newDiscussion.path + newDiscussion.folderName + '/'
        }

        const displayFinalPath = () => {
            if (this.props.discussionsState.newDiscussion.folderName != null) 
                return (
                    <div className={classes.info}>
                        <InfoIcon className={classes.infoIcon}/>
                        <Typography className={classes.infoText}>
                            The discussion will be created at 
                            <span className={classes.infoTextUrl}>
                                {' ' + getFinalPath()}
                            </span>
                        </Typography>
                    </div>
                )
            return null
        }

        return (
            <Card className={classes.card}>
                <CardHeader 
                    className={classes.cardHeader} 
                    title="New discussion" 
                    subheader="Create a new discussion" 
                    />
                <CardContent className={classes.cardContent}>
                    <form 
                        className={classes.container} 
                        noValidate 
                        autoComplete="off">
                        <FormControl 
                            className={classes.formControl}
                            >
                            <TextField
                                error={newDiscussion.nameError != null}
                                label="Discussion name"
                                className={classes.textField}
                                value={newDiscussion.name || ''}
                                onChange={this.changeName}
                                margin="normal"   
                                helperText={newDiscussion.nameError || "The name of the discussion."}   
                                />  
                        </FormControl>
                        <br></br>
                        
                        <FormControl className={classes.formControl}>
                            <div className={classes.selectWrapper}>
                                <InputLabel htmlFor="storage">Storage</InputLabel>
                                <Select
                                    className={classes.select}
                                    value={userState.storages[0]}
                                    onChange={this.changeStorage}
                                    children={userState.storages.map((storage, i) => 
                                        <MenuItem key={i} value={storage}>{storage}</MenuItem>)}
                                    inputProps={{
                                        name: 'storage',
                                        id: 'storage',
                                    }}   
                                    >
                                </Select>
                            </div>
                        </FormControl>
                        <br></br>

                        <FormControl className={classes.formControl}>
                            <TextField
                                label="Folder name"
                                className={classes.textField}
                                value={newDiscussion.folderName || ''}
                                onChange={this.changeFolderName}
                                margin="normal"                                                                 
                                disabled={true}  
                                helperText="The name of the folder that will be created for the discussion."                                                             
                                />  
                        </FormControl>
                        <br></br>

                        <FormControl className={classNames(classes.formControl, classes.changePathControl)}>
                            <TextField
                                label="Folder path"
                                className={classNames(classes.textField)}
                                value={getRelativePath()}
                                onChange={this.changeName}
                                margin="normal"      
                                disabled={true}  
                                InputProps={inputProps}
                                helperText="The path where the folder will be created."                                                                 
                                />  
                        </FormControl>
                        <br></br>
                        
                        <FormControl className={classes.formControl}>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className={classes.checkbox}
                                            checked={newDiscussion.addToPrivateIndex}
                                            onChange={this.changeAddToPrivateIndex}
                                            value="checkedA"
                                            />
                                    }
                                    label="Record in your private type index registry"
                                />                        
                            </FormGroup>
                        </FormControl>
                        
                        {displayFinalPath()}

                    </form>
                </CardContent>
                <CardActions>
                    <Button onClick={createNewDiscussion} color="primary">Create</Button>
                    <Button onClick={cancelNewDiscussion}>Cancel</Button>
                </CardActions>
            </Card>                    
        )
    }
}

export default withStyles(styles, { withTheme: true })(NewDiscussionForm)    