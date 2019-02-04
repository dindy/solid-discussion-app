import React, { Component } from 'react'
import List from '@material-ui/core/List'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from './Explorer.styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import FolderIcon from '@material-ui/icons/Folder'
import HomeIcon from '@material-ui/icons/Home'
import { selectFolder } from '../../actions/explorer'
import LinearProgress from '@material-ui/core/LinearProgress'

class Explorer extends Component {

    handleClose = () => this.props.closeExplorer()
    explore = url => () => this.props.exploreFolder(url)
    goToParent = () => this.props.exploreParentFolder()
    selectFolder = () => this.props.selectFolder(this.props.explorerState.root)

    render() {

        const { classes, layoutState, explorerState, exploreFolder, closeExplorer } = this.props
        const displayCurentFolder = () => {
            if (explorerState.root == explorerState.storage) return explorerState.storage
            return explorerState.root.replace(explorerState.storage, '')
        }
        const displayProgressBar = () => {
            if (explorerState.loading) return <LinearProgress />
            return <div className={classes.hiddenLoader}></div>
        }
        return (   
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={layoutState.explorer.open}
                onClose={this.handleClose}
            >
                <div className={classes.paper}>
                    {displayProgressBar()}
                    <div className={classes.paperInner}>
                        <ListSubheader className={classes.subHeader}>
                            <IconButton
                                className={classes.parentFolderButton}
                                disabled={explorerState.root == explorerState.storage}
                                onClick={this.goToParent}
                                ><ArrowUpwardIcon />
                            </IconButton>                            
                            <div
                                className={classes.rootUrl}
                                >{ displayCurentFolder() }
                            </div>
                            <Button
                                className={classes.selectButton}
                                onClick={this.selectFolder}
                                >Select</Button>
                        </ListSubheader>      
                        <Divider className={classes.hrBottom} />                  
                        <List className={classes.list}>
                            {explorerState.folders
                                .filter(folder => folder.parent == explorerState.root)
                                .map(folder => 
                                    <ListItem 
                                        key={folder.id} 
                                        button
                                        onClick={this.explore(folder.id)}
                                        >
                                        <ListItemIcon>
                                            <FolderIcon />
                                        </ListItemIcon>
                                        {folder.name}
                                    </ListItem>
                                )
                            }
                        </List>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Explorer)    