import * as React from 'react';
import classnames from 'classnames';
import './button.css';

export enum ButtonTypes {
  Success = 'success',
  Error = 'error'
}

export function Button({ children, onClick, buttonType }: React.PropsWithChildren<ButtonProps>) {
  const classNames = classnames('button', {
    'button-success': buttonType === ButtonTypes.Success,
    'button-error': buttonType === ButtonTypes.Error,
  });

  return <button className={classNames} onClick={onClick}>{children}</button>
}

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  buttonType: ButtonTypes;
}