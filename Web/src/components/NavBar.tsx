// Navbar.tsx

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow p-4 flex items-center justify-between">
      <div className="text-2xl font-bold">MyLogo</div>
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded hover:bg-gray-200">Home</button>
        <button className="px-4 py-2 rounded hover:bg-gray-200">
          Analytics
        </button>
        <button className="px-4 py-2 rounded hover:bg-gray-200">
          Settings
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
