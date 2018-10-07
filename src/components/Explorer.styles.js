const styles = theme => ({
    paper: {
      position: 'absolute',
      width: '90vw',
      height: '90vh',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      left: 'calc( (100vw / 2) - (90vw / 2) )',
      top: 'calc( (100vh / 2) - (90vh / 2) )',
      [theme.breakpoints.up('md')]: {
          width: '75vw',
          left: 'calc( (100vw / 2) - (75vw / 2) )',
      },
      [theme.breakpoints.up('lg')]: {
          width: '50vw',
          left: 'calc( (100vw / 2) - (50vw / 2) )',
      },
    },
    paperInner: {
        margin: `${theme.spacing.unit * 4}px 0`,
    },
    subHeader: {
        display: 'flex',
        padding: '0px 4px',
        flexWrap: 'nowrap',
        alignItems: 'center',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
            padding: '0px 12px',
            flexDirection: 'row'
        }
    },
    parentFolderButton: {
        marginRight: 6,
        flexGrow: 0
    },
    selectButton: {
        flexGrow: 0
    },
    rootUrl: {
        flexGrow: 2,
        lineHeight: '24px',
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
            textAlign: 'left'
        }
    },
    hrTop: {
        marginBottom: theme.spacing.unit
    },
    hrBottom: {
        marginTop: theme.spacing.unit
    },
    hiddenLoader: {
        height: 5
    }
})

export default styles