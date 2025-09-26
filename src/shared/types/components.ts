/**
 * Component prop types
 */

import { ReactNode, MouseEvent, ChangeEvent } from 'react';

// Button component types
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps {
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  title?: string;
  'data-testid'?: string;
}

// Input component types
export type InputType = 'text' | 'email' | 'password' | 'url' | 'search' | 'tel' | 'number';

export interface InputProps {
  id?: string;
  name?: string;
  type?: InputType;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  className?: string;
  'data-testid'?: string;
}

// Card component types
export type CardPadding = 'sm' | 'md' | 'lg';
export type CardShadow = 'sm' | 'md' | 'lg' | 'xl';
export type CardRounded = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
  shadow?: CardShadow;
  rounded?: CardRounded;
}

// Alert component types
export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

// Spinner component types
export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

// Modal component types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Table component types
export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}