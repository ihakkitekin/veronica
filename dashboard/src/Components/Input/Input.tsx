import * as React from 'react';
import classnames from 'classnames';
import './input.css';

export function Input({ label, wrapperClassName, ...restProps }: InputProps) {

  const className = classnames(wrapperClassName, 'input');

  return <div className={className}>
    <label>
      {label}
      <input {...restProps}></input>
    </label>
  </div>
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
}