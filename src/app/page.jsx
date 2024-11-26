import Navbar from "@/components/myUi/Navbar";
import TaskTable from "@/components/myUi/TaskTable";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="w-full h-full">
       <Navbar/>

        <div className="white-space-01 w-full h-[100px]"></div>
       <div className="tasks-container flex justify-center">
        <TaskTable />
       </div>
    </div>
  );
}
