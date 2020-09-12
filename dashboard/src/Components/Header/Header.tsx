import * as React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

export function Header(props: HeaderProps) {
  return (
    <header className="header">
      Veronica
      <Link to="/runner">Runner</Link>
    </header>)
}

interface HeaderProps { }