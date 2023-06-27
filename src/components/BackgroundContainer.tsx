const BackgroundContainer = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <div className="background-design">
      <div className="blur-gradient" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundContainer;
