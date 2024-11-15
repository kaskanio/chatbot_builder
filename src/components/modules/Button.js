import classNames from 'classnames';
import { GoSync } from 'react-icons/go';

function Button({
  children,
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  loading,
  ...rest
}) {
  const classes = classNames(
    rest.className,
    'flex items-center px-4 py-1.5 border h-12',
    {
      'opacity-80': loading,
      'border-blue-500 bg-blue-500 text-white primary': primary,
      'border-gray-900 bg-gray-900 text-white secondary': secondary,
      'border-green-500 bg-green-500 text-white success': success,
      'border-yellow-400 bg-yellow-400 text-white warning': warning,
      'border-red-500 bg-red-500 text-white danger': danger,
      'rounded-full': rounded,
      'bg-white': outline,
      'text-blue-500': outline && primary,
      'text-gray-900': outline && secondary,
      'text-green-500': outline && success,
      'text-yellow-400': outline && warning,
      'text-red-500': outline && danger,
    }
  );

  return (
    <button {...rest} disabled={loading} className={classes}>
      {loading ? <GoSync className="animate-spin" /> : children}
    </button>
  );
}

Button.propTypes = {
  checkVariationValue: ({ primary, secondary, success, warning, danger }) => {
    const count =
      Number(!!primary) +
      Number(!!secondary) +
      Number(!!warning) +
      Number(!!success) +
      Number(!!danger);

    if (count > 1) {
      return new Error(
        'Only one of primary, secondary, success, warning, danger can be true'
      );
    }
  },
};

export default Button;
