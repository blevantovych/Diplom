import React, { Component, PureComponent } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import chunk from 'lodash.chunk';

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

const csvIcon = (
  <img
    class="icon icons8-CSV"
    width="26"
    height="26"
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABwUlEQVRIS82WgVHDMAxF2wmACQgTABMQJgAmoGwAEzACMAEZASYgTABMQNgAJoD/chbnunLSlBTQ3b+6sqwv2bKc6cSXQuorYU9g3CWNJi+Euy6jqTOJ4ydhs4cgnb4OhO4yj4jIjoRHYSYQcU5KTTxEk5XGZ56xR/Quww1hp4fE/H0mjl0yj8gWenNesCkRNgtk6yKC7EY4t8jWSQTHidBW4xhEz/Kzm6kWComzHoXI44irsU1mjIwyyUzmiupXibr22KJ902A7F3rQ42c/slnIyBQfMjoW6mhhkeg4XKqIssUxbQqbSjhNjiJLROvACc0UmQm0oTI4YiE6yKgkehsCKToyjo8iS4QRi4wIJ+aUyCuBHohARGc3G5owsjIRi2uBZ4CtYnwQ/kOMENzlEKLD4My2hD2nCHBOo8UhztHfC5wnEhfTUhmxgHPiF2kEtoQ2grBVPAn2TuG0EF7DPD+dRMuUNxkZQeR3bvgSgjHl313YNMKh71Euw/+TkT3lWwqV8SpiRULVMna7N92Bi1kLVGEzkAnHt0IpfF8Dr3tjSCXygfIToXdyJdpAcx8gkHFxMezr2mkwbBeBWg9s578AJCRzG57OQdMAAAAASUVORK5CYII="
  />
);
const excelIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.0"
    x="0px"
    y="0px"
    viewBox="0 0 24 24"
    class="icon icons8-Microsoft-Excel"
  >
    {' '}
    <path d="M 14 2 L 2 4 L 2 20 L 14 22 L 14 2 z M 15 4 L 15 7 L 17 7 L 17 8 L 15 8 L 15 10 L 17 10 L 17 11 L 15 11 L 15 13 L 17 13 L 17 14 L 15 14 L 15 16 L 17 16 L 17 17 L 15 17 L 15 20 L 20 20 C 21.105 20 22 19.105 22 18 L 22 6 C 22 4.895 21.105 4 20 4 L 15 4 z M 18 7 L 20 7 L 20 8 L 18 8 L 18 7 z M 4.21875 8 L 6.28125 8 L 7.34375 10.40625 C 7.43075 10.60125 7.4945 10.8055 7.5625 11.0625 L 7.59375 11.0625 C 7.63275 10.9085 7.72675 10.683 7.84375 10.375 L 9.03125 8 L 10.9375 8 L 8.6875 11.96875 L 11 16 L 8.96875 16 L 7.6875 13.40625 C 7.6385 13.31425 7.57925 13.10075 7.53125 12.84375 L 7.5 12.84375 C 7.471 12.96675 7.43175 13.15925 7.34375 13.40625 L 6.03125 16 L 4 16 L 6.40625 12 L 4.21875 8 z M 18 10 L 20 10 L 20 11 L 18 11 L 18 10 z M 18 13 L 20 13 L 20 14 L 18 14 L 18 13 z M 18 16 L 20 16 L 20 17 L 18 17 L 18 16 z" />
  </svg>
);

class Form extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      points: this.props.formData.points,
      excelTableHeaders: [],
      excelTableInJson: null,
      showColumnChooser: false,
      X: '',
      Y: ''
    };
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
        rows.forEach((row, i) => {
          let xy = row.split(/,\s?/);
          console.log(xy);
          points.push({ x: +xy[0], y: +xy[1] });
        });
      }

      this.setState({ points, showColumnChooser: false });
      this.props.formData.points = points;
    };
    reader.readAsText(input.files[0]);
  };

  componentWillUnmount() {
    this.props.formData.points = this.state.points;
  }

  render() {
    let sortButton = (
      <RaisedButton
        label="Посортувати"
        onTouchTap={() => {
          this.setState({
            points: [...this.state.points].sort((p1, p2) => {
              return +p1.x > +p2.x ? 1 : -1;
            })
          });
        }}
      />
    );
    let addClearBtns = (
      <div style={{ height: '100%' }}>
        <RaisedButton
          label="Очистити"
          secondary={true}
          containerElement="label"
          onTouchTap={() =>
            this.setState({
              points: [{ x: 0, y: 0 }]
            })
          }
        />
        <RaisedButton
          label="Додати"
          secondary={true}
          containerElement="label"
          onTouchTap={() =>
            this.setState({
              points: [...this.state.points, { x: 0, y: 0 }]
            })
          }
        />
      </div>
    );

    let x_vals_tds = this.state.points.map((val, i) => (
      <td>
        <span
          class="delete_td_popup"
          onClick={() => {
            let copy = [...this.state.points];
            copy.splice(i, 1);
            this.setState({ points: copy });
          }}
        >
          X
        </span>
        <TextField
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
      <td>
        <span
          class="delete_td_popup"
          onClick={() => {
            let copy = [...this.state.points];
            copy.splice(i, 1);
            this.setState({ points: copy });
          }}
        >
          X
        </span>
        <TextField
          value={val.y}
          onChange={e => {
            val.y = e.target.value;
            this.forceUpdate();
          }}
          style={{ width: '50px' }}
        />
      </td>
    ));

    x_vals_tds.push(sortButton);
    y_vals_tds.push(addClearBtns);
    let separateXTds = chunk(x_vals_tds, 10);
    let separateYTds = chunk(y_vals_tds, 10);

    let tables = separateXTds.map((xTds, i) => (
      <div>
        <table class="discrete_table">
          <tr>
            <td>X</td>
            {xTds}
          </tr>
          <tr>
            <td>Y</td>
            {separateYTds[i]}
          </tr>
        </table>
        <br />
      </div>
    ));

    return (
      <div class="form">
        <TextField
          floatingLabelText="Степінь"
          type="number"
          defaultValue={this.props.formData.deg}
          onChange={e => (this.props.formData.deg = +e.target.value)}
        />
        {tables}
        <br />

        <div className="upload_btns">
          <RaisedButton
            label="Завантажити CSV"
            secondary={true}
            icon={<span>{csvIcon}</span>}
            containerElement="label"
          >
            <input
              class="file_input"
              type="file"
              onChange={this.onFileUpload}
            />
          </RaisedButton>

          <RaisedButton
            label="Завантажити Excel"
            labelPosition="before"
            icon={<span>{excelIcon}</span>}
            secondary={true}
            containerElement="label"
          >
            <input
              class="file_input"
              type="file"
              onChange={this.onExcelUpload}
            />
          </RaisedButton>
        </div>

        <div
          class="xy_chooser"
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
              onTouchTap={() => {
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
        </div>

        <RaisedButton
          label="Обчислити"
          primary={true}
          onClick={() => {
            let xs = this.state.points.map(p => +p.x);
            let ys = this.state.points.map(p => +p.y);
            this.props.onCalcClick(xs, ys, +this.props.formData.deg);
          }}
        />
      </div>
    );
  }
}

Form.defaultProps = {
  formData: {
    points: [],
    deg: 2
  }
};

export default Form;
