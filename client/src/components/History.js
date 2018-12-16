import React from 'react';
import { Tabs, Tab } from '@material-ui/core/Tabs';
import SwipeableViews from 'react-swipeable-views';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  },
  slide: {
    padding: 10
  }
};

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };
  }

  handleChange = value => {
    this.setState({
      slideIndex: value
    });
  };

  render() {
    return (
      <div>
        <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
          <Tab label="Мінімакс" value={0} />
          <Tab label="Мінімакс (дискретний)" value={1} />
          <Tab label="МНК" value={2} />
          <Tab label="МНК (дискретний)" value={3} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div>
            <h2 style={styles.headline}>Tabs with slide effect</h2>
            Історія Мінімакс<br />
          </div>
          <div style={styles.slide}>Історія Мінімакс(дискретний)</div>
          <div style={styles.slide}>Історія МНК</div>
          <div style={styles.slide}>Історія МНК (дискретний)</div>
        </SwipeableViews>
      </div>
    );
  }
}

export default History;
