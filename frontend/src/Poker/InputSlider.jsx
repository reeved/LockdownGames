/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    color: 'white',
    borderRadius: '50%',
    height: '0',
    width: '0',
    padding: '5vmin',
    fontSize: 'calc(5px + 1vmin)',
    marginRight: '1em',
  },
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
  fold: {
    backgroundColor: '#d00000',
    '&:hover': {
      backgroundColor: '#d93333',
    },
  },
  raise: {
    backgroundColor: '#F72585',
    '&:hover': {
      backgroundColor: '#f966aa',
    },
  },
});

export default function InputSlider({ minRaise, maxRaise, handleBackButton, handleRaiseButton }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(minRaise);

  const multiplier = (maxRaise - minRaise) / 100;
  const oneStep = (maxRaise - minRaise) / 10;

  const handleSliderChange = (event, newValue) => {
    setValue(newValue * multiplier + minRaise);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < minRaise) {
      setValue(minRaise);
    } else if (value > maxRaise) {
      setValue(maxRaise);
    }
  };

  return (
    <div>
      <Grid container justify="space-between">
        <Grid item xs={12}>
          <Slider
            value={typeof value === 'number' ? (value - minRaise) / multiplier : minRaise}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid container spacing={1} justify="space-evenly">
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: oneStep,
              min: minRaise,
              max: maxRaise,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
          <Button className={`${classes.button} ${classes.fold}`} variant="contained" onClick={() => handleBackButton()}>
            Back
          </Button>
          <Button className={`${classes.button} ${classes.raise}`} variant="contained" onClick={() => handleRaiseButton(value)}>
            Raise
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
