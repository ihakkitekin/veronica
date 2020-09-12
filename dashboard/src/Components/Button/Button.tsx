import * as React from 'react';
import classnames from 'classnames';
import './button.css';

export enum ButtonTypes {
  Success = 'success',
  Error = 'error'
}

export function Button({ children, buttonType, ...restProps }: React.PropsWithChildren<ButtonProps>) {
  const classNames = classnames(restProps.className, 'button', {
    'button-success': buttonType === ButtonTypes.Success,
    'button-error': buttonType === ButtonTypes.Error,
  });

  return <button {...restProps} className={classNames}>{children}</button>
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  buttonType: ButtonTypes;
}