import classNames from 'classnames';
import useNavigation from '../hooks/use-navigation';

function Link({ to, children, isActive, onClick }) {
  const { navigate } = useNavigation();

  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    event.preventDefault();
    navigate(to);
    if (onClick) {
      onClick();
    }
  };

  return (
    <a href={to} onClick={handleClick}>
      <div
        className={classNames(
          'flex items-center py-1.5 px-4 rounded cursor-pointer transition-colors duration-200',
          {
            'bg-blue-700 ': isActive, // Apply light blue background and less bright text when active
            'text-gray-100 hover:bg-gray-800': !isActive, // Less bright text and hover effect when not active
          }
        )}
      >
        {children}
      </div>
    </a>
  );
}

export default Link;
