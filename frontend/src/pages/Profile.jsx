import { useSelector } from 'react-redux'

function Profile() {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-3xl font-bold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="profile" className='h-24 w-24 self-center border-2 rounded-full cursor-pointer object-cover' />
        <input type="text" placeholder='username' className='p-3 border rounded-lg' id='username' />
        <input type="email" placeholder='email' className='p-3 border rounded-lg' id='email' />
        <input type="text" placeholder='password' className='p-3 border rounded-lg' id='password' />
        <button className='bg-slate-700 text-white p-3 rounded-lg font-semibold hover:bg-slate-600 disabled:bg-slate-500'>Update</button>
      </form>
      <div className="flex items-center justify-between mt-4">
        <span className='text-red-700 cursor-pointer hover:underline'>Delete Account </span>
        <span className='text-red-700 cursor-pointer hover:underline'>Sign Out </span>
      </div>
    </div>
  )
}

export default Profile
