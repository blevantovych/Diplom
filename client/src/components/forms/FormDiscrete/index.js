import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import chunk from 'lodash.chunk';
import {
  DiscreteTable,
  UploadButtons,
  XYChooser,
  FormContainer,
  FileInput,
  DeleteTdPopup,
  Pin
} from './style';
import { csvIcon, excelIcon } from './icons';
import PinIcon from '../../PinIcon';

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
  });

  return result;
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deg: 2,
      points: [{ x: 0, y: 0 }],
      excelTableHeaders: [],
      excelTableInJson: null,
      showColumnChooser: false,
      X: '',
      Y: '',
      pinnedPoints: []
    };
  }

  onPinClick = x => () => {
    if (this.state.pinnedPoints.includes(x)) {
      const index = this.state.pinnedPoints.indexOf(x);
      this.setState({pinnedPoints: [
        ...this.state.pinnedPoints.slice(0, index),
        ...this.state.pinnedPoints.slice(index + 1)
      ]})
    } else {
      this.setState({pinnedPoints: [...this.state.pinnedPoints, x]})
    }
  }

  processWorkBook = wb => {
    let excelTableInJson = to_json(wb).Sheet1;
    let headers = Object.keys(excelTableInJson[0]);
    console.log('Headers\n', headers);
    this.setState({
      excelTableHeaders: headers,
      excelTableInJson,
      showColumnChooser: true
    });
  };

  onExcelUpload = e => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      let data = e.target.result;
      let wb = XLSX.read(data, { type: 'binary' });
      this.processWorkBook(wb);
    };
    reader.readAsBinaryString(file);
  };

  onFileUpload = (event, type = 'vert') => {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      // if horizontal
      const data = reader.result;
      let rows = data.split('\n');
      let points = [];
      if (type === 'hor') {
        let x_vals = rows[0].split(/,\s?/g);
        let y_vals = rows[1].split(/,\s?/g);
        x_vals.forEach((val, i) => {
          points.push({ x: +val, y: +y_vals[i] });
        });
      } else if (type === 'vert') {
        rows.forEach(row => {
          let xy = row.split(/,\s?/);
          console.log(xy);
          points.push({ x: +xy[0], y: +xy[1] });
        });
      }

      this.setState({ points, showColumnChooser: false });
      // this.props.formData.points = points;
    };
    reader.readAsText(input.files[0]);
  };

  render() {
    console.log(this.state.pinnedPoints)
    let sortButton = (
      <RaisedButton
        label="Посортувати"
        onClick={() => {
          this.setState({
            points: [...this.state.points].sort((p1, p2) =>
              +p1.x > +p2.x ? 1 : -1
            )
          });
        }}
      />
    );
    let addClearBtns = (
      <td key="add_clear_btns" style={{ height: '100%' }}>
        <RaisedButton
          label="Очистити"
          secondary={true}
          containerElement="label"
          onClick={() =>
            this.setState({
              points: [{ x: 0, y: 0 }]
            })
          }
        />
        <RaisedButton
          label="Додати"
          secondary={true}
          containerElement="label"
          onClick={() =>
            this.setState({
              points: [...this.state.points, { x: 0, y: 0 }]
            })
          }
        />
      </td>
    );

    let x_vals_tds = this.state.points.map((val, i) => (
      <td key={i}>
        <DeleteTdPopup
          title="Видалити стовпець"
          class="delete_td_popup"
          onClick={() => {
            let copy = [...this.state.points];
            copy.splice(i, 1);
            this.setState({ points: copy });
          }}
        />
        <Pin
          title="Pin point"
          className="pin"
          pinned={this.state.pinnedPoints.includes(val.x)}
          onClick={this.onPinClick(val.x)}>
          <PinIcon />
        </Pin>
        <TextField
          id={`text-field${val.x}`}
          value={val.x}
          onChange={e => {
            val.x = e.target.value;
            this.forceUpdate();
          }}
          style={{ width: '50px' }}
        />
      </td>
    ));
    let y_vals_tds = this.state.points.map((val, i) => (
      <td key={i}>
        <DeleteTdPopup
          title="Видалити стовпець"
          class="delete_td_popup"
          onClick={() => {
            let copy = [...this.state.points];
            copy.splice(i, 1);
            this.setState({ points: copy });
          }}
        />
        <TextField
          id="text-field"
          value={val.y}
          onChange={e => {
            val.y = e.target.value;
            this.forceUpdate();
          }}
          style={{ width: '50px' }}
        />
      </td>
    ));

    x_vals_tds.push(<td key="sort button">{sortButton}</td>);
    y_vals_tds.push(addClearBtns);
    let separateXTds = chunk(x_vals_tds, 10);
    let separateYTds = chunk(y_vals_tds, 10);

    let tables = separateXTds.map((xTds, i) => (
      <div key={i}>
        <DiscreteTable>
          <tbody>
            <tr>
              <td>X</td>
              {xTds}
            </tr>
            <tr>
              <td>Y</td>
              {separateYTds[i]}
            </tr>
          </tbody>
          {/* {sortButton} */}
          {/* {addClearBtns} */}
        </DiscreteTable>
        <br />
      </div>
    ));

    return (
      <FormContainer>
        <TextField
          floatingLabelText="Степінь"
          type="number"
          value={this.state.deg || ''}
          onChange={e => this.setState({ deg: +e.target.value })}
        />

        {tables}
        <br />

        <UploadButtons>
          <RaisedButton
            label="Завантажити CSV"
            secondary={true}
            icon={<span>{csvIcon}</span>}
            containerElement="label"
          >
            <FileInput type="file" onChange={this.onFileUpload} />
          </RaisedButton>

          <RaisedButton
            label="Завантажити Excel"
            labelPosition="before"
            icon={<span>{excelIcon}</span>}
            secondary={true}
            containerElement="label"
          >
            <FileInput type="file" onChange={this.onExcelUpload} />
          </RaisedButton>
        </UploadButtons>

        <XYChooser
          style={{
            visibility: this.state.showColumnChooser ? 'visible' : 'hidden'
          }}
        >
          <div>
            <SelectField
              value={this.state.X}
              floatingLabelText="X"
              floatingLabelFixed={true}
              hintText="X"
              onChange={(e, i, val) => {
                if (this.state.Y) {
                  this.setState({
                    points: this.state.excelTableInJson.map(r => ({
                      x: r[val],
                      y: r[this.state.Y]
                    })),
                    X: val
                  });
                } else this.setState({ X: val });
              }}
            >
              {this.state.excelTableHeaders.map((h, i) => (
                <MenuItem key={i} value={h} primaryText={h} />
              ))}
            </SelectField>
          </div>

          <div>
            <RaisedButton
              label="<=>"
              onClick={() => {
                this.setState({
                  X: this.state.Y,
                  Y: this.state.X,
                  points: this.state.excelTableInJson.map(r => ({
                    x: r[this.state.Y],
                    y: r[this.state.X]
                  }))
                });
              }}
            />
          </div>

          <div>
            <SelectField
              value={this.state.Y}
              floatingLabelText="Y"
              floatingLabelFixed={true}
              hintText="Y"
              onChange={(e, i, val) => {
                if (this.state.X) {
                  this.setState({
                    points: this.state.excelTableInJson.map(r => ({
                      x: r[this.state.X],
                      y: r[val]
                    })),
                    Y: val
                  });
                } else this.setState({ Y: val });
              }}
            >
              {this.state.excelTableHeaders.map((h, i) => (
                <MenuItem key={i} value={h} primaryText={h} />
              ))}
            </SelectField>
          </div>
        </XYChooser>

        <RaisedButton
          label="Обчислити"
          primary={true}
          onClick={() => {
            let xs = this.state.points.map(p => +p.x);
            let ys = this.state.points.map(p => +p.y);
            this.props.onCalcClick(xs, ys, this.state.deg);
          }}
        />
      </FormContainer>
    );
  }
}

Form.propTypes = {
  onCalcClick: PropTypes.func
};

Form.defaultProps = {
  formData: {
    points: [],
    deg: 2
  }
};

export default Form;
