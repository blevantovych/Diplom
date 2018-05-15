import React, { Component, PureComponent } from 'react';
import styled from 'styled-components';
import { TextField, RaisedButton } from 'material-ui';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
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
          defaultValue={this.props.formData.func}
          onChange={e => (this.props.formData.func = e.target.value)}
        />

        <TextField
          floatingLabelText="Степінь многочлена"
          type="number"
          defaultValue={this.props.formData.deg}
          onChange={e => (this.props.formData.deg = +e.target.value)}
        />

        <TextField
          floatingLabelText="Початок інтервалу"
          type="number"
          defaultValue={this.props.formData.start}
          onChange={e => (this.props.formData.start = +e.target.value)}
        />

        <TextField
          floatingLabelText="Кінець інтервалу"
          type="number"
          defaultValue={this.props.formData.end}
          onChange={e => (this.props.formData.end = +e.target.value)}
        />

        {this.props.minmax && (
          <TextField
            floatingLabelText="Точність"
            type="number"
            defaultValue={this.props.formData.precision}
            onChange={e => (this.props.formData.precision = +e.target.value)}
          />
        )}

        {this.props.lssq && (
          <TextField
            floatingLabelText="Точки розбиття"
            type="number"
            defaultValue={this.props.formData.points}
            onChange={e => (this.props.formData.points = +e.target.value)}
          />
        )}

        <RaisedButton
          label="Обчислити"
          primary={true}
          onClick={() =>
            this.props.onCalcClick(
              this.props.formData.func,
              this.props.formData.start,
              this.props.formData.end,
              this.props.formData.deg,
              this.props.formData.precision,
              this.props.formData.points
            )
          }
        />
      </FormContainer>
    );
  }
}

Form.defaultProps = {
  formData: {
    func: 'sin(x)',
    start: 0,
    end: 3,
    deg: 2,
    precision: 0.01,
    points: 10
  }
};

export default Form;
