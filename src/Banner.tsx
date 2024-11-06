import React, { useState, useEffect } from 'react';
import './Banner.css';
import { format, parseISO} from 'date-fns';

interface categoryId {
  id: string;
  displayName: string;
}
interface BannerProps {
  id: string;
  title: string;
  startDate: string;
  client: Function;
}


const Banner: React.FC<BannerProps> = ({ id, title, startDate, client }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryIds, setCategoryIds] = useState<categoryId[] | null >(null)

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    if(isOpen && !categoryIds){
      getSingleCategoryIds(id)
    }
  }, [isOpen])

  useEffect(()=>{
    console.log("categoryIds", categoryIds)
  }, [categoryIds])

  function formatDateTime(inputString: string): string {
    const date = parseISO(inputString); // Parse the ISO string into a Date object
    return format(date, 'MM/dd/yyyy hh:mm a'); // Format the date as "mm/dd/yyyy hh:mm am/pm"
  }

  function getSingleCategoryIds(projectId:string) {
    const apiString = `/eqlist-line-item/nodes-by-ids?equipmentListId=${projectId}`
    client({API_STRING: apiString}).then((res: { data: any; })=> {
      
      // const response: string = JSON.stringify(res.data);
      setCategoryIds(JSON.parse(String(res.data)))
      console.log(res)
    }).catch((err: any)=>console.log(err))
  }
  
  return (
    <div className="banner">
      <div className="banner-header" onClick={toggleOpen}>
        <h3>{title}</h3>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && 
        <div className="banner-content">
          {formatDateTime(startDate)}
          <ul className="categoryIds">
            {categoryIds?.map((lineItem, index) => (
              <li key={index}>
                {lineItem?.id}
              </li>
            ))}
          </ul>

        </div>}
    </div>
  );
};

export default Banner;