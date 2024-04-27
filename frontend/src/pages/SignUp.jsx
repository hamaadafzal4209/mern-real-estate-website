import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/backend/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      
      // Navigate to "/sign-in" after successful signup
      navigate('/sign-in');
    } catch (error) {
      console.error('An error occurred:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="">
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username" onChange={handleChange} />
        <input type="text" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange} />
        <input type="text" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange} />
        <button type="submit" className="bg-slate-700 text-white rounded-lg hover:bg-slate-600 uppercase font-semibold p-3 disabled:bg-slate-500" disabled={loading}>
          {loading ? 'Loading...' : 'Sign up'}
        </button>
      </form>
      <div className="flex gap-3 mt-4">
        <p>Have an account</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
