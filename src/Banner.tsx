import React, { useState, useEffect } from 'react';
import './css/Banner.css';
import { format, parseISO} from 'date-fns';

interface BannerProps { //Props coming into this component.
  client: Function;
  project: AwaitingPrep
}
interface AwaitingPrep {
  id:string;
  displayName: string;
  calcStartDate: string;
}
interface CategoryId { //Definition of each category header (Audio, Lighting, etc)
  id: string;
  displayName: string;
}
interface CategoryLineItems { //Definition of each line item within a category
  id: string;
  parentLineItemId: string;
  displayName: string;
  lineQtyInfo: LineQtyInfo;
}
interface LineQtyInfo { //inner object describing completion of prep
  requiredQty: number;
  preppedQty: number;
}
interface CategoryContent { // New Object containing parentLineItemId as id with related content || lineiteminfo
  id: string;
  displayName: string;
  calcStartDate: string;
  requiredScannedItems: number;
  currentScannedItems: number;
  content: CategoryLineItems[];
}

const Banner: React.FC<BannerProps> = ({ project, client }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryIds, setCategoryIds] = useState<CategoryId[] | null >(null)
  const [categoryLineItems, setCategoryLineItems] = useState<CategoryContent[]>([])

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    if(isOpen && !categoryIds){ //Load categoryIds on first dropdown.
      getSingleCategoryIds(project.id) 
    }
  }, [isOpen])

  useEffect(()=>{
    if(categoryIds){
      categoryIds.forEach((cat)=>{
        const currentDate = new Date().getTime(); // Today's date in milliseconds
        const fiveDaysFromNow = currentDate + 5 * 24 * 60 * 60 * 1000; // Add 5 days in milliseconds
        
        const projectDate = new Date(project.calcStartDate).getTime();
        
        if (projectDate <= fiveDaysFromNow && projectDate >= currentDate - fiveDaysFromNow) {
          // The project date is within 5 days from today
          getCategoryLineItems(project.id, cat.id)
          // console.log(project.displayName, "categoryIds", categoryIds)
        }
      })
    }
    
  }, [categoryIds])



  useEffect(()=>{
    if(categoryLineItems){
      console.log(project.displayName, "categoryLineItems", categoryLineItems, categoryIds)
      console.log(project.id)
    }
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

  function buildCategoryLineItems(
    categoryIds: CategoryId[],
    responseArray: CategoryLineItems[]
  ): CategoryContent[] {
    if (!categoryIds || categoryIds.length === 0) return [];
  
    return categoryIds.reduce<CategoryContent[]>((acc, item) => {
      // Filter responseArray to find elements matching the current category id
      const content = responseArray.filter(el => el.parentLineItemId === item.id);

      // Add to the accumulator only if there's content
      if (content.length > 0) {
        acc.push({
          id: item.id,
          displayName: item.displayName,
          calcStartDate: project.calcStartDate,
          requiredScannedItems: 0,
          currentScannedItems: 0,
          content,
        });
      }

      return acc;
    }, []);
  }

  function getCategoryLineItems(projectId:string, categoryId:string){
    const apiString = `/eqlist-line-item/node-list/${categoryId}?equipmentListId=${projectId}`
    client({API_STRING: apiString}).then((res: { data: any; })=> {
      const responseArray = JSON.parse(String(res.data))?.content
      
      
  if (responseArray && categoryIds) {
    const updatedArray = buildCategoryLineItems(categoryIds, responseArray);

      setCategoryLineItems((prev: CategoryContent[]) => {
        // Create a copy of the previous state
        const updatedCategoryLineItems = [...prev];

      updatedArray.forEach(newItem => {
        const existingIndex = updatedCategoryLineItems.findIndex(
          existingItem => existingItem.id === newItem.id
        );

        if (existingIndex !== -1) {
          console.log('existing item')
          // Update the content field of the existing element
          updatedCategoryLineItems[existingIndex] = {
            ...updatedCategoryLineItems[existingIndex],
            content: newItem.content,
            requiredScannedItems: newItem.content.reduce((acc, item)=>{
              acc += item.lineQtyInfo.requiredQty
              return acc
            }, 0),
            currentScannedItems: newItem.content.reduce((acc, item)=>{
              acc += item.lineQtyInfo.preppedQty
              return acc
            }, 0)
          };
        } else {
          // Add the new element if it doesn't already exist
          updatedCategoryLineItems.push(newItem);
          console.log('new item')
        }
        });

        return updatedCategoryLineItems
      });
    }
    }).catch((err: any)=>console.log(err))
  }
  
  return (
    <div className="banner">
      <div className="banner-header" onClick={toggleOpen}>
        <h3>{project.displayName}</h3>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span> 
      </div>
      {isOpen && 
        <div className="banner-content">
          {formatDateTime(project.calcStartDate)}
          <ul className="categoryIds">
          {categoryIds?.map((category, index) => (
              <li key={index}>
                {/* Display the category's display name */}
                {category?.displayName}

                {/* Button to load items for the category */}
                <button onClick={() => getCategoryLineItems(project.id, category.id)}>Load Items</button>

                {/* Check if a matching categoryLineItem exists */}
                {categoryLineItems
                  .filter((el: CategoryContent) => el.id === category.id) // Filter for matching items
                  .map((el: CategoryContent) => (
                    <ul key={el.id}>
                      {/* Map through the content field of the matching categoryLineItem */}
                      {el.content.map((c: CategoryLineItems, contentIndex) => (
                        <li key={contentIndex}>
                          {/* Replace `c.field` with actual properties from LineQtyInfo */}
                          <h3>{c.displayName || "No data"}, Progress: {c.lineQtyInfo.preppedQty/c.lineQtyInfo.requiredQty*100}%</h3>
                          <div>
                            Required: {c.lineQtyInfo.requiredQty} <br />
                            Prepped: {c.lineQtyInfo.preppedQty}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ))}
              </li>
            ))}
          </ul>

        </div>}
    </div>
  );
};

export default Banner;
