import React, { useState, useEffect } from 'react';
import './Banner.css';
import { format, parseISO} from 'date-fns';

interface BannerProps { //Props coming into this component.
  id: string;
  title: string;
  startDate: string;
  client: Function;
}
interface categoryId { //Definition of each category header (Audio, Lighting, etc)
  id: string;
  displayName: string;
  categoryLineItems: categoryLineItems[] | []
}
interface categoryLineItems { //Definition of each line item within a category
  id: string;
  displayName: string;
  lineQtyInfo: lineQtyInfo;
  parentLineItemId: string;
}
interface lineQtyInfo { //inner object describing completion of prep
  requiredQty: number;
  preppedQty: number;
}


const Banner: React.FC<BannerProps> = ({ id, title, startDate, client }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryIds, setCategoryIds] = useState<categoryId[] | null >(null)
  const [categoryLineItems, setCategoryLineItems] = useState<categoryLineItems[] | null[]>([])

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    if(isOpen && !categoryIds){ //Load categoryIds on first dropdown.
      getSingleCategoryIds(id) 
    }
  }, [isOpen])

  useEffect(()=>{
    console.log("categoryIds", categoryIds)
  }, [categoryIds])
  useEffect(()=>{
    console.log("categoryLineItems", categoryLineItems)
  }, [categoryLineItems])

  function formatDateTime(inputString: string): string {
    const date = parseISO(inputString); // Parse the ISO string into a Date object
    return format(date, 'MM/dd/yyyy hh:mm a'); // Format the date as "mm/dd/yyyy hh:mm am/pm"
  }

  function getSingleCategoryIds(projectId:string) {
    const apiString = `/eqlist-line-item/nodes-by-ids?equipmentListId=${projectId}`
    client({API_STRING: apiString}).then((res: { data: any; })=> {
      const response = JSON.parse(String(res.data))
      setCategoryIds(response)
      
    }).catch((err: any)=>console.log(err))
  }

  function getCategoryLineItems(projectId:string, categoryId:string){
    const apiString = `/eqlist-line-item/node-list/${categoryId}?equipmentListId=${projectId}&page=0`
    client({API_STRING: apiString}).then((res: { data: any; })=> {
      const responseArray = JSON.parse(String(res.data))?.content
      const updatedArray = categoryIds?.reduce((acc: any, item) => {
        let currentCatLineItemArray = responseArray.map((el:categoryLineItems, index: number) => {
          return el.parentLineItemId == item.id && el 
        })
        if (item.displayName) {
          return [ ...acc, { [item.displayName]: currentCatLineItemArray }];
        }
        return acc;
      }, categoryLineItems);
      setCategoryLineItems(updatedArray)
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
            {categoryIds?.map((category, index) => (
              
              <li key={index}>
                {category?.displayName}
                <button onClick={()=>getCategoryLineItems(id, category.id)}>load items</button>
                <ul className="categoryLineItems">
                  {categoryLineItems?.map((item) => (
                      <li key={item?.id}>
                        <strong>{item?.displayName}</strong>
                      </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

        </div>}
    </div>
  );
};

export default Banner;
