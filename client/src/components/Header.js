import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropRight from '@material-ui/icons/ArrowRight'
// import ArrowDropRight from '@material-ui/core/svg-icons/navigation-arrow-drop-right';
import { withRouter } from 'react-router-dom';

import Hamburger from '@material-ui/icons/Menu';

const pathNameToTitle = {
  '/ls-discrete': 'МНК (дискретна функція)',
  '/minmax-discrete': 'Мінімакс (дискретна функція)',
  '/comparison-discrete': 'Порівняти Мінімакс і МНК',
  '/ls': 'МНК',
  '/minmax': 'Мінімакс',
  '/comparison-continuous': 'Порівняти Мінімакс і МНК',
  '/spline': 'Побудова сплайну (мінімакс)',
  '/continuous-spline': 'Побудова неперервного сплайну (мінімакс)',
  '/continuous-spline-segments-specified':
    'Побудова неперервного сплайну (мінімакс) з заданою кількістю ланок',
  '/spline-minmax-discrete': 'Мінімаксний сплайн (дискретний випадок)',
  '/spline-with-specified-number-of-segments': 'Мінімаксний сплайн з заданою кількістю ланок',
  '/spline-with-precision': 'Мінімаксний сплайн з заданою похибкою'
};

const Menu_ = props => (
  <Menu
    open={true}
    // iconButtonElement={
    //   <IconButton>
    //     <Hamburger color={'white'} />
    //   </IconButton>
    // }
    // targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    // anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
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
      rightIcon={<ArrowDropRight />}
      menuItems={[
        <MenuItem
          primaryText="З заданою похибкою"
          onClick={() => props.history.push('/spline-with-precision')}
        />,
        <MenuItem
          primaryText="З заданою кількістю ланок"
          onClick={() => props.history.push('/spline-with-specified-number-of-segments')}
        />,
        // <MenuItem
        //   primaryText="Апроксимація неперервними сплайнами з заданою кількістю ланок"
        //   onClick={() =>
        //     props.history.push('/continuous-spline-segments-specified')
        //   }
        // />,
        // <MenuItem
        //   primaryText="Мінімаксний сплайн (дискретний випадок)"
        //   onClick={() =>
        //     props.history.push('/spline-minmax-discrete')
        //   }
        // />
      ]}
    />
  
    {/*<MenuItem
            primaryText="Історія"
            onTouchTap={() => props.onMenuChange(4)}
        />*/}
    {/* <MenuItem primaryText="Як користуватися (pdf)">
      <a id="download_desc_link" href="/program_description.pdf" download="" />
    </MenuItem> */}
  </Menu>
);

class Header extends Component {
  render() {
    return (
      <div>
        
        <AppBar
          id="header"
          title={pathNameToTitle[this.props.location.pathname]}
          // children={<h1>hi</h1>}
          // children={<Menu_
          //   onMenuChange={this.props.onMenuChange}
          //   history={this.props.history}
          // />}
        // showMenuIconButton={false}
        >
          <MenuIcon />
        </AppBar>
      </div>
    );
  }
}

export default withRouter(Header);
