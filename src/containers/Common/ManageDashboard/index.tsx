import React, { useEffect, useState } from "react";
import { getUserOverviewData } from "../../../services/dashboard/index";
import { Box, Image, Text } from "@mantine/core";
import { camelCaseToTitleCase } from "../../../helper/helper";


function ManageDashboard() {
  const [userOverviewData, setUserOverviewData] = useState<any>({});

  // Function to fetch user overview data
  const handleGetUserOverviewData = async () => {
    try {
      const response = await getUserOverviewData();
      if (response) {
        setUserOverviewData(response);
      }
    } catch (error) {
      console.error("Error fetching user overview data:", error);
    }
  };

  useEffect(() => {
    handleGetUserOverviewData();
  }, []);

  const renderCards = () => {
   return (
     <div
       style={{
         display: "flex",
         justifyContent: "space-around",
         margin: "30px",
         padding: "10px",
       }}
     >
       {Object.keys(userOverviewData).map((key, index) => (
         <Box
           key={index}
           style={{
             width: "100%",
             display: "flex",
             padding: "8px",
             flexDirection: "column",
             alignItems: "left",
             borderRadius: 8,
             boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.2)",
             position: "relative",
             margin: "0 10px",
           }}
         >
           <Text
             align="left"
             size="md"
             weight={600}
             style={{ marginBottom: 8, paddingLeft: "10px" }}
           >
             {camelCaseToTitleCase(key)}
           </Text>

           <div
             style={{
               display: "flex",
               justifyContent: "space-between",
               paddingRight: "10px",
               paddingLeft: "10px",
             }}
           >
             <Text align="left" weight={800} style={{ fontSize: 40 }}>
               {userOverviewData[key]}
             </Text>
             <Image
               radius="md"
               src={`/assets/images/${key}.png`} // Assuming image filenames correspond to keys
               alt=""
               style={{
                 width: 70, // Set width of the image
               }}
             />
           </div>
         </Box>
       ))}
     </div>
   );
  };

  return <div>{renderCards()}</div>;
}

export default ManageDashboard;
