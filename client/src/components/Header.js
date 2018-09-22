import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import { withRouter } from 'react-router-dom';

import Hamburger from 'material-ui/svg-icons/navigation/menu';

const pathNameToTitle = {
  '/ls-discrete': 'МНК (дискретна функція)',
  '/minmax-discrete': 'Мінімакс (дискретна функція)',
  '/comparison-discrete': 'Порівняти Мінімакс і МНК',
  '/ls': 'МНК',
  '/minmax': 'Мінімакс',
  '/comparison-continuous': 'Порівняти Мінімакс і МНК',
  '/spline': 'Побудова сплайну (мінімакс)',
  '/continuous-spline': 'Побудова неперервного сплайну (мінімакс)'
};

const Menu = props => (
  <IconMenu
    iconButtonElement={
      <IconButton>
        <Hamburger color={'white'} />
      </IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem
      primaryText="Дискретний випадок"
      rightIcon={<ArrowDropRight />}
      menuItems={[
        <MenuItem
          key="МНК_дискр"
          primaryText="МНК"
          onClick={() => props.history.push('/ls-discrete')}
        />,
        <MenuItem
          key="Мінімакс_дискр"
          primaryText="Мінімакс"
          onClick={() => props.history.push('/minmax-discrete')}
        />,
        <MenuItem
          key="Порівняти_дискр"
          primaryText="Порівняти"
          onClick={() => props.history.push('/comparison-discrete')}
        />
      ]}
    />
    <MenuItem
      primaryText="Неперервний випадок"
      rightIcon={<ArrowDropRight />}
      menuItems={[
        <MenuItem
          key="МНК"
          primaryText="МНК"
          onClick={() => props.history.push('/ls')}
        />,
        <MenuItem
          key="Мінімакс"
          primaryText="Мінімакс"
          onClick={() => props.history.push('/minmax')}
        />,
        <MenuItem
          key="Порівняти"
          primaryText="Порівняти"
          onClick={() => props.history.push('/comparison-continuous')}
        />
      ]}
    />
    <MenuItem
      primaryText="Апроксимація сплайнами"
      onClick={() => props.history.push('/spline')}
    />
    <MenuItem
      primaryText="Апроксимація неперервними сплайнами"
      onClick={() => props.history.push('/continuous-spline')}
    />
    {/*<MenuItem
            primaryText="Історія"
            onTouchTap={() => props.onMenuChange(4)}
        />*/}
    {/* <MenuItem primaryText="Як користуватися (pdf)">
      <a id="download_desc_link" href="/program_description.pdf" download="" />
    </MenuItem> */}
  </IconMenu>
);

class Header extends Component {
  render() {
    return (
      <AppBar
        // style={{  position: 'fixed', top: 0, width: '60vw' }}
        title={pathNameToTitle[this.props.location.pathname]}
        showMenuIconButton={false}
        iconElementRight={
          <Menu
            onMenuChange={this.props.onMenuChange}
            history={this.props.history}
          />
        }
      />
    );
  }
}

export default withRouter(Header);