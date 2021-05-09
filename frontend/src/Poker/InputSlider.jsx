import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { Button } from '@material-ui/core';
import styles from './Player.module.css';

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

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
    width: '20%',
    margin: '0 2em',
    fontSize: 'calc(14px + 2vmin)',
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

export default function InputSlider({ minRaise, maxRaise, handleBackButton, handleRaiseButton, pot }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(minRaise);

  const multiplier = (maxRaise - minRaise) / 100;
  const oneStep = (maxRaise - minRaise) / 10;

  const handleSliderChange = (event, newValue) => {
    const raiseValue = newValue * multiplier + minRaise;
    const roundedValue = Math.ceil(raiseValue / 10) * 10;
    setValue(roundedValue);
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
    <div className={styles.raiseButtons}>
      <div className={styles.easyButtonsContainer}>
        <Button variant="contained" onClick={() => setValue(minRaise)}>
          Min RAISE
        </Button>
        <Button variant="contained" onClick={() => setValue(Math.max(minRaise, pot / 2))}>
          1/2 POT
        </Button>
        <Button variant="contained" onClick={() => setValue(Math.max(minRaise, (pot * 3) / 4))}>
          3/4 POT
        </Button>
        <Button variant="contained" onClick={() => setValue(Math.max(minRaise, pot))}>
          POT
        </Button>
        <Button variant="contained" onClick={() => setValue(maxRaise)}>
          ALL IN
        </Button>
      </div>
      <div>
        <div className={styles.slider}>
          <PrettoSlider
            value={typeof value === 'number' ? (value - minRaise) / multiplier : minRaise}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </div>
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
      </div>
    </div>
  );
}
