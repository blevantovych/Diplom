import React, { Component, PureComponent } from "react";
import styled from "styled-components";
import { TextField, RaisedButton } from "material-ui";
import { Translate } from "react-localize-redux";

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
      <Translate>
        {({ translate }) => (
          <FormContainer>
            <TextField
              floatingLabelText={translate("form.func")}
              type="text"
              value={this.props.func}
              onChange={e => this.props.changeFunc(e.target.value)}
            />

            <TextField
              floatingLabelText={translate("form.degree")}
              type="number"
              value={this.props.deg}
              onChange={e => this.props.changeDeg(e.target.value)}
            />

            <TextField
              floatingLabelText={translate("form.start")}
              type="number"
              value={this.props.start}
              onChange={e => this.props.changeStart(e.target.value)}
            />

            <TextField
              floatingLabelText={translate("form.end")}
              type="number"
              value={this.props.end}
              onChange={e => this.props.changeEnd(e.target.value)}
            />

            {this.props.minmax && (
              <TextField
                floatingLabelText={translate("form.precision")}
                type="number"
                value={this.props.precision}
                onChange={e => this.props.changePrecision(e.target.value)}
              />
            )}

            {this.props.lssq && (
              <TextField
                floatingLabelText={translate("form.points")}
                type="number"
                value={this.props.points}
                onChange={e => this.props.changePoints(e.target.value)}
              />
            )}

            <RaisedButton
              label={translate("form.calc")}
              primary={true}
              onClick={this.props.onCalcClick}
            />
          </FormContainer>
        )}
      </Translate>
    );
  }
}

Form.defaultProps = {
  func: "sin(x)",
  start: "0",
  end: "3",
  deg: "2",
  precision: "0.01",
  points: "10"
};

export default Form;
