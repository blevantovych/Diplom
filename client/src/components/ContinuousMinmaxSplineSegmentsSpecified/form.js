import React from "react";
import { Formik } from "formik";
import { TextField, RaisedButton } from "material-ui";
import styled from "styled-components";
import { Translate } from "react-localize-redux";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContinuousMinmaxSplineSegmentsSpecifiedForm = ({ onCalcClick }) => (
  <div>
    <Formik
      initialValues={{
        func: "sin(x)",
        start: 0,
        end: 3,
        deg: 2,
        segments: 2
      }}
    >
      {props => {
        const { values, handleChange } = props;
        console.log(props);
        return (
          <Translate>
            {({ translate }) => (
              <FormContainer>
                <TextField
                  floatingLabelText={translate("form.func")}
                  type="text"
                  name="func"
                  value={values.func}
                  onChange={handleChange}
                />

                <TextField
                  floatingLabelText={translate("form.degree")}
                  type="number"
                  name="deg"
                  value={values.deg}
                  onChange={handleChange}
                />

                <TextField
                  floatingLabelText={translate("form.start")}
                  type="number"
                  name="start"
                  value={values.start}
                  onChange={handleChange}
                />

                <TextField
                  floatingLabelText={translate("form.end")}
                  type="number"
                  name="end"
                  value={values.end}
                  onChange={handleChange}
                />

                <TextField
                  floatingLabelText={translate("form.number_of_segments")}
                  type="number"
                  name="segments"
                  value={values.segments}
                  onChange={handleChange}
                />

                <RaisedButton
                  label={translate("form.calc")}
                  primary={true}
                  onClick={() => onCalcClick(values)}
                />
              </FormContainer>
            )}
          </Translate>
        );
      }}
    </Formik>
  </div>
);

export default ContinuousMinmaxSplineSegmentsSpecifiedForm;
