import React from 'react';
import './header.css';
import logo from '../imgs/logo.png';

class Header extends React.Component {
  render() {
    return (
      <div className="components-header row">
    <img src={logo} width="40" alt="" className="-col-auto"/>
        <h1 className="caption">Music Player By create-react-app</h1>
      </div>
    );
  }
}

export default Header;