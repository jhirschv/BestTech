import Topbar from '@/components/shared/Topbar';
import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from '../components/shared/Sidebar'
import '@/index.css';

const RootLayout = () => {

  const scrollContainerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [location]);
  
  return (
    <div className='h-screen w-full flex flex-col'>
       <Topbar />        
        <div ref={scrollContainerRef} className='scrollable-container flex w-full flex-1 min-h-0 overflow-y-auto py-14'>
          <Outlet />
        </div>
    </div>
  )
}

export default RootLayout