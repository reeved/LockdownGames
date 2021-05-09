/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    borderRadius: '0.5em',
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    height: '80vh',
    width: '50vw',
    backgroundColor: '#303030',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    color: 'white',
    backgroundColor: '#F72585',
    '&:hover': {
      backgroundColor: '#F966A8',
    },
  },
}));

export default function GeneralModal({ child, buttonText, buttonEvent }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function handleButtonClick() {
    if (buttonEvent) {
      buttonEvent();
    }
    handleOpen();
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      {child}
    </div>
  );

  return (
    <div>
      <Button variant="contained" className={classes.button} type="button" onClick={() => handleButtonClick()}>
        {buttonText}
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
        {body}
      </Modal>
    </div>
  );
}
