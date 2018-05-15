import React from 'react';

import Iteration from './Iteration';
import Plot from '../Plot';

const lineStyles = {
  color: 'rgb(32, 206, 15)',
  dash: 'dash'
};

export default class IterationList extends React.Component {
  constructor(props) {
    super(props);
  }
  plotNum = 1;

  handleClicks = e => {
    if (e.keyCode == 37) {
      if (this.plotNum === 0) {
        this.plotNum = this.props.arr.length - 1;
      } else {
        this.plotNum--;
      }
      this.changeErrPlot();
    }
    if (e.keyCode == 39) {
      this.plotNum++;
      if (this.plotNum === this.props.arr.length) {
        this.plotNum = 0;
      }
      this.changeErrPlot();
    }
  };
  changeErrPlot = () => {
    if (this.plotNum >= this.props.arr.length) {
      this.plotNum = 0;
    }
    Plotly.animate(
      'plotall_errors',
      {
        data: [
          {
            x: this.props.arr[this.plotNum].error_plot[0],
            y: this.props.arr[this.plotNum].error_plot[1]
          },
          {
            x: this.props.arr[this.plotNum].alternance,
            y: this.props.arr[this.plotNum].err_in_each_point,
            mode: 'markers'
          },
          {
            x: this.props.arr[this.plotNum].error_plot[0],
            y: Array(this.props.arr[this.plotNum].error_plot[0].length).fill(
              this.props.arr[this.plotNum].err_in_each_point[0]
            ),
            line: lineStyles
          },
          {
            x: this.props.arr[this.plotNum].error_plot[0],
            y: Array(this.props.arr[this.plotNum].error_plot[0].length).fill(
              -this.props.arr[this.plotNum].err_in_each_point[0]
            ),
            line: lineStyles
          },
          {
            ...this.props.arr[this.plotNum].max_err_in_error_plot,
            mode: 'lines',
            name: 'Макс. похибка',
            line: {
              color: 'rgba(255, 0, 0, 0.6)'
            }
          }
        ],
        layout: {
          title: `Ітерація ${this.plotNum + 1}`
        }
      },
      {
        transition: {
          duration: 500,
          easing: 'cubic-in-out'
        }
      }
    );
  };

  render() {
    // setInterval(this.changeErrPlot, 5000)
    const computationTime =
      this.props.arr.length > 0
        ? `Час рахування: ${this.props.arr[0].computation_time.toFixed(2)}`
        : null;

    const iters = this.props.arr.map((el, i, a) => {
      return (
        <Iteration
          isLast={i === a.length - 1}
          key={i}
          ctn={i}
          data={el}
          precision={this.props.arr[0].precision}
        />
      );
    });

    const yMin = Math.min(
      ...this.props.arr.map(i => Math.min(...i.error_plot[1]))
    );
    const yMax = Math.max(
      ...this.props.arr.map(i => Math.max(...i.error_plot[1]))
    );

    return (
      <div>
        {iters}
        {this.props.arr.length > 0 && (
          <div
            //onClick={this.changeErrPlot}
            onKeyDown={this.handleClicks}
            tabIndex="0"
          >
            <Plot
              id="all_errors"
              title="Ітерація 1"
              //plotData={this.props.arr.map(el => ({
              //  x: el.error_plot[0],
              //  y: el.error_plot[1],
              //}))}
              yRange={[yMin - Math.abs(yMin) * 0.1, yMax + yMax * 0.1]}
              plotData={[
                {
                  x: this.props.arr[0].error_plot[0],
                  y: this.props.arr[0].error_plot[1],
                  name: 'Функція похибки'
                },
                {
                  x: this.props.arr[0].alternance,
                  y: this.props.arr[0].err_in_each_point,
                  mode: 'markers',
                  name: 'Точки альтернансу'
                },
                {
                  x: this.props.arr[0].error_plot[0],
                  y: Array(this.props.arr[0].error_plot[0].length).fill(
                    this.props.arr[0].err_in_each_point[0]
                  ),
                  line: lineStyles,
                  //visible: 'legendonly'
                  showlegend: false
                },
                {
                  x: this.props.arr[0].error_plot[0],
                  y: Array(this.props.arr[0].error_plot[0].length).fill(
                    -this.props.arr[0].err_in_each_point[0]
                  ),
                  line: lineStyles,
                  showlegend: false
                  //visible: 'legendonly'
                },
                {
                  ...this.props.arr[0].max_err_in_error_plot,
                  mode: 'lines',
                  name: 'Макс. похибка',
                  line: {
                    color: 'rgba(255, 0, 0, 0.6)'
                  }
                }
              ]}
            />
          </div>
        )}
        {computationTime}
      </div>
    );
  }
}
