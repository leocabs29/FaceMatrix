import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
const mess =() => {
  toast.success('Successfully toasted!')

}
function Nav() {
  return (
   
    <div className="flex border border-gray-100  font-secondary w-full justify-between p-4 font-bold text-sky-900 items-center">
      <Link to={'/'} className="lg:text-2xl text-xl">FaceMatrix</Link>
      <div className="md:flex  space-x-4 items-center hidden">
        
        <div onClick={mess}  className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2 hover:bg-sky-900 hover:text-white">Home</div>
        <Link  to="/gallery" className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2 hover:bg-sky-900  hover:text-white">Captures</Link>
       <Toaster/>
        <Link to={"/"} className="text-sm lg:text-md rounded-lg hover:cursor-pointer px-4 py-2 hover:bg-sky-900  hover:text-white">Camera</Link>
      </div>
      <div className="md:hidden">
      <MenuRoundedIcon className="text-sky-900 md:hidden" />
      </div>
    </div>
  );
}

export default Nav;
