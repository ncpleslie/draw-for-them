const LoadingIndicator: React.FC = () => {
  return (
    <div className="neu-container h-20 w-20 rounded-full flex justify-center items-center">
      <div className="border-[14px] border-icon-split-active absolute h-[4.25rem] w-[4.25rem] rounded-full animate-spin"></div>
      <div className="neu-container h-10 w-10 rounded-full"></div>
    </div>
  );
};

export default LoadingIndicator;
