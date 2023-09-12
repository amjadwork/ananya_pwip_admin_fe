import React, { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import { useHover } from "@mantine/hooks";
import APIRequest from "../../helper/api";
import { showNotification } from "@mantine/notifications";
import { FileSpreadsheet, NewSection, FilePlus } from "tabler-icons-react";
import { MessageTemplates, messages } from "../../constants/messages.constants";
import {
  createStyles,
  Card,
  Text,
  SimpleGrid,
  UnstyledButton,
  Anchor,
  Group,
  Image,
  Button,
} from "@mantine/core";

import { useMantineTheme } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    height: "80vh",
  },
  infoCard: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.white[4],
    height: "60%",
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: theme.radius.md,
    height: 220,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease, transform 100ms ease",

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.05)",
    },
  },
  hoverEffect: {
    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.01)",
    },
  },
}));

function SheetUpload(props:any) {
  const containerType=props.containerType;
  const [jsonData, setJsonData] = useState<any>([]);
  const [isFileSelected, setIsFileSelected] = useState(false);


  const capitalContainerType = containerType.charAt(0).toUpperCase() + containerType.slice(1);

  const containerMessages = (messages as MessageTemplates)[containerType] || {
    successMessage: "",
    errorMessage: "Unknown container type",
  };

  useEffect(() => {
    console.log(jsonData);
  }, [jsonData]);

  let END_POINT_TO_GET = "";
  let END_POINT_TO_UPDATE = "";
  let END_POINT_TO_POST = "";

  switch (containerType) {
    case "variant":
      END_POINT_TO_GET = `${containerType}/excel`;
      END_POINT_TO_UPDATE = `${containerType}/price/update`;
      END_POINT_TO_POST = `${containerType}/bysheet`;
      break;
  
    case "transportation":
    case "cha":
    case "ofc":
    case "shl":
      END_POINT_TO_GET = `${containerType}/excel`;
      END_POINT_TO_UPDATE = `${containerType}/update`;
      END_POINT_TO_POST= `${containerType}/addbyexcel`;
      break;
  
    default:
      END_POINT_TO_GET = `${containerType}/excel`;
      END_POINT_TO_UPDATE = `${containerType}/update`;
      END_POINT_TO_POST= `${containerType}/addbyexcel`;
      break;
  }

  const handleSheetToJson = (e: any) => {
    e.preventDefault();
    if (e) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        const payload = { data: json };
        setJsonData(payload);
        setIsFileSelected(true); 
      };
      reader.readAsArrayBuffer(e.target.files[0]);
      setUploadedSheet(e.target.files[0].name);
    }
  };
  const handleJsonUploadForUpdatePrice = async () => {
    const response = await APIRequest(END_POINT_TO_UPDATE, "PATCH", jsonData);
    showNotification({
    //   title: response.success?"Updated Price ":"something went wrong",
    //   message: `update as per sheet`,
    // });
    title: response.success
    ? containerMessages.successMessage
    : "Something went wrong",
  message: response.success
    ? `No of rows added ${response.added}`
    : containerMessages.errorMessage,
   });  
    if (response) {
      return "success";
    }
  };

  const handleJsonUploadForAddingVariant = async () => {
    try {
      const response = await APIRequest(END_POINT_TO_POST, "POST", jsonData);
      
      let title, message;
      if (response.success) {
        title = containerMessages.successMessage;
        message = `No of rows added ${response.added}`;
      } else {
        title = "Something went wrong";
        message = containerMessages.errorMessage;
      }
      showNotification({
        title,
        message,
      });
      return "success";
    } catch (error) {
      console.error("API request error:", error);
      throw error; 
    }
  };
  
  const handleDownloadSampleSheetForPriceUpdate = async () => {
    const response = await APIRequest(END_POINT_TO_GET, "GETEXCEL")
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `${containerType}_data_sheet_for_update` + ".xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        showNotification({
          title: "Something went wrong !",
          message: "please try again",
        });
      });
    // console.log(response);
  };

  const mockdata = [
    { title:  
    containerType === "variant" ? "Upload Existing Variant Price": `Upload Existing ${capitalContainerType} Charges`, icon: FileSpreadsheet, color: "blue" },
    { title: containerType === "variant" ? "Add New Variant Price": `Add New ${capitalContainerType} Charges`, icon: NewSection, color: "green" },
  ];
  const { classes, theme } = useStyles();
  const [hoveredTabName, setHoveredTabName] = useState("update");
  const [selectedTabName, setSelectedTabName] = useState("");
  const items = mockdata.map((item) => {
    return (
      <UnstyledButton
        key={item.title}
        className={classes.item}
        onMouseOver={() => {
          if (item.title === "Upload Existing Variant Price" || item.title === `Upload Existing ${capitalContainerType} Charges`) {
            setHoveredTabName("update");
          } else setHoveredTabName("add");
        }}
        onClick={() => {
          if (item.title === "Upload Existing Variant Price" || item.title === `Upload Existing ${capitalContainerType} Charges`) {
            setSelectedTabName("update");
          } else setSelectedTabName("add");
        }}
      >
        <item.icon color={theme.colors[item.color][6]} size="3rem" />
        <Text size="md" mt={7}>
          {item.title}
        </Text>
      </UnstyledButton>
    );
  });

  const updatePriceInfoCard = () => {
    return (
      <Card
        withBorder
        radius="md"
        className={classes.infoCard}
        style={{
          position: "absolute",
          width: "97%",
          bottom: 0,
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Card.Section
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="https://www.benlcollins.com/ebook_35_tips_gifs/gifs/conditional_formatting.gif"
            height={"100%"}
            width={"90%"}
            alt="No way!"
          />
        </Card.Section>
        <div style={{ width: "50%", margin: 20, paddingLeft: 20 }}>
          <Text weight={500} size="lg" mt="md">
            Update {capitalContainerType} Data by Excel Sheet
          </Text>

          <Text mt="xs" color="dimmed" size="sm">
          Please click on the Upload button above to proceed with the following action.
          </Text>
        </div>
      </Card>
    );
  };
  const addVariantInfoCard = () => {
    return (
      <Card
        withBorder
        radius="md"
        className={classes.infoCard}
        style={{
          position: "absolute",
          width: "97%",
          bottom: 0,
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Card.Section
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="https://www.w3schools.com/excel/min4.png"
            height={"100%"}
            alt="No way!"
          />
        </Card.Section>
        <div style={{ width: "50%", margin: 20, paddingLeft: 20 }}>
          <Text weight={500} size="lg" mt="md">
            Add New {capitalContainerType} Data by Excel
          </Text>

          <Text mt="xs" color="dimmed" size="sm">
           Please click on the Add button above to proceed with the following action. 
          </Text>
        </div>
      </Card>
    );
  };

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [uploadedSheet, setUploadedSheet] = useState(null);

  function updateDataForm() {
    // setJsonData([])
    // setUploadedSheet(null)
    return (
      <div
        style={{
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <input
          type="file"
          id="upload"
          name="upload"
          ref={hiddenFileInput}
          accept=" application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleSheetToJson}
          style={{ display: "none" }}
        />
        <div
          className={classes.hoverEffect}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "75%",
            border: "1px solid grey",
            borderRadius: "10px",
          }}
          onClick={() => {
            console.log("object");
            if (hiddenFileInput.current !== null) {
              hiddenFileInput.current.click();
            }
          }}
        >
          <FilePlus size={200} strokeWidth={0.4} color={"green"} />
          {
            
          }
          <div>
            <Text size="xl" inline>
              {uploadedSheet?`${uploadedSheet}`:`Update Existing - Click here to Browse File`}
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              
               {uploadedSheet?`Attached file successfully!`:`Download Current Data Sheet below to make the changes and upload the updated excel.`}
             
            </Text>
          </div>
        </div>

        <Group
          style={{
            display: "flex",
            height: "20%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          position="right"
          mt="md"
          spacing="sm"
        >
          <div>
            <Button
              variant="light"
              color="blue"
              type="reset"
              onClick={() => {
                handleDownloadSampleSheetForPriceUpdate();
              }}
            >
             Download Current Data Sheet
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outline"
              color="red"
              type="reset"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setSelectedTabName("");
                setUploadedSheet(null)
                setJsonData([])
              }}
            >
              cancel
            </Button>
            <Button
              variant="light"
              color="dark"
              type="reset"
              style={{ marginRight: "10px" }}
              onClick={()=>{
                setUploadedSheet(null)
                setJsonData([])
              }}
            >
              Reset
            </Button>

            <Button 
            variant="filled" 
            type="button"
             onClick={handleJsonUploadForUpdatePrice}
             disabled={!isFileSelected}>
              Upload Excel Sheet
            </Button>
          </div>
        </Group>
      </div>
    );
  }
  function addNewDataForm() {
    // setJsonData([])
    // setUploadedSheet(null)
    return (
      <div
        style={{
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <input
          type="file"
          id="upload"
          name="upload"
          ref={hiddenFileInput}
          accept=" application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleSheetToJson}
          style={{ display: "none" }}
        />
        <div
          className={classes.hoverEffect}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "75%",
            border: "1px solid grey",
            borderRadius: "10px",
          }}
          onClick={() => {
            console.log("object");
            if (hiddenFileInput.current !== null) {
              hiddenFileInput.current.click();
            }
          }}
        >
          <FilePlus size={200} strokeWidth={0.4} color={"green"} />
          {
            
          }
          <div>
            <Text size="xl" inline>
              {uploadedSheet?`${uploadedSheet}`:`Add New - Click here to Browse File`}
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              
               {uploadedSheet?`Attached file successfully!`:`Make sure the excel sheet is in the desired format to add new data effortlessly`}
            </Text>
          </div>
        </div>

        <Group
          style={{
            display: "flex",
            justifyContent: "flex-end", 
            alignItems: "center",
            paddingTop: 50,
          }}
          position="right"
          spacing="md"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outline"
              color="red"
              type="reset"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setSelectedTabName("");
                setUploadedSheet(null)
                setJsonData([])
              }}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              color="dark"
              type="reset"
              style={{ marginRight: "10px" }}
              onClick={()=>{
                setUploadedSheet(null)
                setJsonData([])
              }}
            >
              Reset
            </Button>

            <Button 
            variant="filled" 
            type="button" 
            onClick={handleJsonUploadForAddingVariant}
            disabled={!isFileSelected}>
              Upload Excel Sheet
            </Button>
          </div>
        </Group>
      </div>
    );
  }
  return (
    <div>
      <Card
        withBorder
        radius="md"
        className={classes.card}
        style={{ position: "relative", width: "100%" }}
      >
        {
          selectedTabName == "" ? (
            <>
              <SimpleGrid cols={2} mt="md">
                {items}
              </SimpleGrid>

              {hoveredTabName == "update"
                ? updatePriceInfoCard()
                : addVariantInfoCard()}
            </>
          ) : selectedTabName == "update" ? (
            updateDataForm()
          ) : (
            addNewDataForm()
          )
        }
      </Card>
    </div>
  );
}

export default SheetUpload;
