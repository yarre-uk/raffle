const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <h1 className="text-2xl font-medium">Home Page</h1>
      <h2 className="text-lg font-medium">Welcome to my Raffle</h2>
      <img src="./raffle.png" alt="raffle tickets" className="w-[30%]" />
    </div>
  );
};

export default HomePage;
