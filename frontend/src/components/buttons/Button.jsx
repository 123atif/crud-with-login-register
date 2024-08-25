export const Button = ({
  children,
  className,
  onClick,
  type,
  disabled,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={
        "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto mb-2 sm:mb-0 " +
        className
      }
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
