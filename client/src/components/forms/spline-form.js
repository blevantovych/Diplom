import React, { Component, PureComponent } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const styles = theme => ({
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    maxWidth: 400,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class Form extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <FormContainer>
        <TextField
          className={classes.textField}
          label="Функція, яку апроксимуємо"
          type="text"
          value={this.props.func}
          onChange={e => this.props.changeFunc(e.target.value)}
        />

        <TextField
          className={classes.textField}
          label="Степінь многочлена"
          type="number"
          value={this.props.deg}
          onChange={e => this.props.changeDeg(e.target.value)}
        />

        <TextField
          className={classes.textField}
          label="Початок інтервалу"
          type="number"
          value={this.props.start}
          onChange={e => this.props.changeStart(e.target.value)}
        />

        <TextField
          className={classes.textField}
          label="Кінець інтервалу"
          type="number"
          value={this.props.end}
          onChange={e => this.props.changeEnd(e.target.value)}
        />

        <TextField
          className={classes.textField}
          label="Точність"
          type="number"
          value={this.props.precision}
          onChange={e => this.props.changePrecision(e.target.value)}
        />

        <TextField
          className={classes.textField}
          label="Допустима похибка на одному відрізку сплайна"
          type="number"
          // style={{ width: '370px' }}
          value={this.props.allowedErrorOnSplineSegment}
          onChange={e => this.props.changeAllowedError(e.target.value)}
        />

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Тип сплайна</FormLabel>
          <RadioGroup
            aria-label="Gender"
            name="gender1"
            className={classes.group}
            value={this.props.type || 'interpolated'}
            onChange={e => this.props.changeType(e.target.value)}
          >
            <FormControlLabel value="interpolated" control={<Radio />} label="Інтерполяційний" />
            <FormControlLabel value="continuous" control={<Radio />} label="Неперервний" />
            <FormControlLabel value="discontinuous" control={<Radio />} label="Розривний" />
          </RadioGroup>
        </FormControl>

        <Button onClick={this.props.onCalcClick} color="primary">Обчислити</Button>
      </FormContainer>
    );
  }
}

Form.defaultProps = {
  func: 'sin(x)',
  start: 0,
  end: 3,
  deg: 2,
  precision: 0.01,
  points: 10
};

export default withStyles(styles)(Form);
