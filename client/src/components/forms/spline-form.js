import React, { Component, PureComponent } from 'react';
import styled from 'styled-components';
import { TextField, RaisedButton } from 'material-ui';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class Form extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormContainer>
        <TextField
          floatingLabelText="Функція, яку апроксимуємо"
          type="text"
          value={this.props.func}
          onChange={e => this.props.changeFunc(e.target.value)}
        />

        <TextField
          floatingLabelText="Степінь многочлена"
          type="number"
          value={this.props.deg}
          onChange={e => this.props.changeDeg(+e.target.value)}
        />

        <TextField
          floatingLabelText="Початок інтервалу"
          type="number"
          value={this.props.start}
          onChange={e => this.props.changeStart(+e.target.value)}
        />

        <TextField
          floatingLabelText="Кінець інтервалу"
          type="number"
          value={this.props.end}
          onChange={e => this.props.changeEnd(+e.target.value)}
        />

        <TextField
          floatingLabelText="Точність"
          type="number"
          value={this.props.precision}
          onChange={e => this.props.changePrecision(+e.target.value)}
        />

        <TextField
          floatingLabelText="Допустима похибка на одному відрізку сплайна"
          type="number"
          style={{ width: '370px' }}
          value={this.props.allowedErrorOnSplineSegment}
          onChange={e => this.props.changeAllowedError(+e.target.value)}
        />

        <RaisedButton
          label="Обчислити"
          primary={true}
          onClick={this.props.onCalcClick}
        />
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

export default Form;
