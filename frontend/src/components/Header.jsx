import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
    const { currentUser } = useSelector(state => state.user);

    return (
        <header className="bg-slate-200 shadow-md">
            <div className="flex items-center justify-between p-3 max-w-6xl mx-auto">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-lg md:text-xl">
                        <span className="text-slate-500">Serene</span>
                        <span className="text-slate-700">Estate</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 p-3 flex items-center justify-between rounded-lg gap-2 font-semibold">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none w-24 sm:w-64"
                    />
                    <FaSearch className="text-slate-600" />
                </form>
                <ul className="flex items-center sm:gap-4 md:gap-6 font-semibold">
                    <Link to="/">
                        <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">Home</li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">About</li>
                    </Link>
                    <Link to="/profile">
                        {currentUser ? (
                            <img className="rounded-full h-8 object-cover" src={currentUser.avatar} alt="profile" />
                        ) : (
                            <li className="text-slate-700 hover:underline cursor-pointer">Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
}

export default Header;
