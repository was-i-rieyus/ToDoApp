import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const Navbar = () => {
  return (
    <div className="w-full bg-black text-white h-[50px] flex items-center p-5 justify-between">
      <p>Task Manager</p>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Navbar;
