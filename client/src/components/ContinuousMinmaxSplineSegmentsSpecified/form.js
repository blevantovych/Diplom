import React from 'react';
import { Formik } from 'formik';
import { TextField, RaisedButton } from 'material-ui';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContinuousMinmaxSplineSegmentsSpecifiedForm = ({onCalcClick}) => (
  <div>
    <Formik
      initialValues={{
        func: 'sin(x)',
        start: 0,
        end: 3,
        deg: 2,
        segments: 2
      }}
    >
      {props => {
        const {
          values,
          handleChange,
        } = props;
        console.log(props);
        return (
          <FormContainer>
            <TextField
              floatingLabelText="Функція, яку апроксимуємо"
              type="text"
              name="func"
              value={values.func}
              onChange={handleChange}
            />

            <TextField
              floatingLabelText="Степінь многочлена"
              type="number"
              name="deg"
              value={values.deg}
              onChange={handleChange}
            />

            <TextField
              floatingLabelText="Початок інтервалу"
              type="number"
              name="start"
              value={values.start}
              onChange={handleChange}
            />

            <TextField
              floatingLabelText="Кінець інтервалу"
              type="number"
              name="end"
              value={values.end}
              onChange={handleChange}
            />

            <TextField
              floatingLabelText="Кількість ланок"
              type="number"
              name="segments"
              value={values.segments}
              onChange={handleChange}
            />

            <RaisedButton
              label="Обчислити"
              primary={true}
              onClick={() => onCalcClick(values)}
            />
          </FormContainer>
        );
      }}
    </Formik>
  </div>
);

export default ContinuousMinmaxSplineSegmentsSpecifiedForm;
