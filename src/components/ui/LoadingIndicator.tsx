const LoadingIndicator: React.FC = () => {
  return (
    <div
      role="progressbar"
      title="loading"
      aria-label="loading"
      className="neu-container flex h-20 w-20 items-center justify-center !rounded-full"
    >
      <div className="absolute h-[4.25rem] w-[4.25rem] animate-spin rounded-full border-[14px] border-icon-split-active"></div>
      <div className="neu-container h-10 w-10 !rounded-full"></div>
    </div>
  );
};

export default LoadingIndicator;
