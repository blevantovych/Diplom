import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import { withRouter } from 'react-router-dom'
import { Translate, withLocalize } from 'react-localize-redux'

import Hamburger from 'material-ui/svg-icons/navigation/menu'

const pathNameToTitle = (translate, path) =>
  ({
    '/ls-discrete': translate('header.ls-discrete'),
    '/minmax-discrete': translate('header.minmax-discrete'),
    '/comparison-discrete': translate('header.comparison-discrete'),
    '/ls': translate('header.ls'),
    '/minmax': translate('header.minmax'),
    '/comparison-continuous': translate('header.comparison-continuous'),
    '/spline': translate('header.spline'),
    '/continuous-spline': translate('header.continuous-spline'),
    '/continuous-spline-segments-specified': translate(
      'header.continuous-spline-segments-specified'
    ),
    '/spline-minmax-discrete': translate('header.spline-minmax-discrete')
  }[path])

const Menu = props => (
  <Translate>
    {({ translate }) => (
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
          primaryText={translate('menu.discrete_case')}
          rightIcon={<ArrowDropRight />}
          menuItems={[
            <MenuItem
              key="МНК_дискр"
              primaryText={translate('menu.ls')}
              onClick={() => props.history.push('/ls-discrete')}
            />,
            <MenuItem
              key="Мінімакс_дискр"
              primaryText={translate('menu.minimax')}
              onClick={() => props.history.push('/minmax-discrete')}
            />,
            <MenuItem
              key="Порівняти_дискр"
              primaryText={translate('menu.compare')}
              onClick={() => props.history.push('/comparison-discrete')}
            />
          ]}
        />
        <MenuItem
          primaryText={translate('menu.continuous')}
          rightIcon={<ArrowDropRight />}
          menuItems={[
            <MenuItem
              key="МНК"
              primaryText={translate('menu.ls')}
              onClick={() => props.history.push('/ls')}
            />,
            <MenuItem
              key="Мінімакс"
              primaryText={translate('menu.minimax')}
              onClick={() => props.history.push('/minmax')}
            />,
            <MenuItem
              key="Порівняти"
              primaryText={translate('menu.compare')}
              onClick={() => props.history.push('/comparison-continuous')}
            />
          ]}
        />
        <MenuItem
          primaryText={translate('menu.spline_approximation')}
          onClick={() => props.history.push('/spline')}
        />
        <MenuItem
          primaryText={translate('menu.continuous_spline_approximation')}
          onClick={() => props.history.push('/continuous-spline')}
        />
        <MenuItem
          primaryText={translate('menu.points_specified')}
          onClick={() =>
            props.history.push('/continuous-spline-segments-specified')
          }
        />
        <MenuItem
          primaryText={translate('menu.minmax_spline_discrete')}
          onClick={() => props.history.push('/spline-minmax-discrete')}
        />
        {/*<MenuItem
            primaryText="Історія"
            onTouchTap={() => props.onMenuChange(4)}
        />*/}
        {/* <MenuItem primaryText="Як користуватися (pdf)">
      <a id="download_desc_link" href="/program_description.pdf" download="" />
    </MenuItem> */}
      </IconMenu>
    )}
  </Translate>
)
// withLocalize(LanguageToggle)

const LanguageToggle = withLocalize(({ languages, setActiveLanguage }) => (
  <div>
    {languages.map(lang => (
      <span
        style={{ cursor: 'pointer', marginLeft: '10px', color: 'white' }}
        key={lang.code}
        onClick={() => setActiveLanguage(lang.code)}
      >
        {lang.name}
      </span>
    ))}
  </div>
))
class Header extends Component {
  render() {
    return (
      <Translate>
        {({ translate }) => (
          <div>
            <AppBar
              id="header"
              title={pathNameToTitle(translate, this.props.location.pathname)}
              showMenuIconButton={false}
              iconElementRight={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <LanguageToggle />
                  <Menu
                    onMenuChange={this.props.onMenuChange}
                    history={this.props.history}
                  />
                </div>
              }
            />
          </div>
        )}
      </Translate>
    )
  }
}

export default withRouter(Header)
