import React, { useEffect, useRef, useState } from "react";
import { Alert, Flex } from "@mantine/core";
import * as xlsx from "xlsx";
import { useHover } from "@mantine/hooks";
import APIRequest from "../../helper/api";
import { showNotification } from "@mantine/notifications";
import {
  IconCreditCard,
  IconBuildingBank,
  IconRepeat,
  IconReceiptRefund,
  IconReceipt,
  IconReceiptTax,
  IconReport,
  IconCashBanknote,
  IconCoin,
} from "@tabler/icons-react";
import { FileSpreadsheet, CoinRupee, Car, FilePlus } from "tabler-icons-react";
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
import { position } from "html2canvas/dist/types/css/property-descriptors/position";

import { useMantineTheme } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import axios from "axios";

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

function SheetUpload() {
  const [jsonData, setJsonData] = useState<any>([]);
  useEffect(() => {
    console.log(jsonData);
  }, [jsonData]);

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
      };
      reader.readAsArrayBuffer(e.target.files[0]);
      setUploadedSheet(e.target.files[0].name);
    }
  };
  const handleJsonUploadForUpdatePrice = async () => {
    const response = await APIRequest("variant/price/update", "PATCH", jsonData);
    showNotification({
      title: response.success?"Updated Price ":"something went wrong",
      message: `update as per sheet`,
    });
    if (response) {
      return "success";
    }
  };
  const handleJsonUploadForAddingVariant = async () => {
    const response = await APIRequest("variant/bysheet", "POST", jsonData);
    showNotification({
      title: response.success?"ADD VARIANTS ":"something went wrong",
      message: `No of rows added ${response.added}`,
    });
    if (response) {
      return "success";
    }
  };
  const handleDownloadSampleSheetForPriceUpdate = async () => {
    const response = await APIRequest("variant/excel", "GETEXCEL")
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "sample_variant_price_update_sheet" + ".xlsx";
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
  const handleDownloadSampleSheetForAddingVariant = async () => {
    const response = await APIRequest("variant/excel", "GETEXCEL")
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "sample_variant_price_update_sheet" + ".xlsx";
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
    { title: "Update price only", icon: CoinRupee, color: "yellow" },
    { title: "Add variants", icon: FileSpreadsheet, color: "indigo" },
  ];
  const { classes, theme } = useStyles();
  const { hovered, ref } = useHover();
  const [hoveredTabName, setHoveredTabName] = useState("update");
  const [selectedTabName, setSelectedTabName] = useState("");
  const items = mockdata.map((item) => {
    return (
      <UnstyledButton
        key={item.title}
        className={classes.item}
        onMouseOver={() => {
          if (item.title == "Update price only") {
            setHoveredTabName("update");
          } else setHoveredTabName("add");
        }}
        onClick={() => {
          if (item.title == "Update price only") {
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
            Update Price by Excel sheet
          </Text>

          <Text mt="xs" color="dimmed" size="sm">
            Please click anywhere on this card to claim your reward, this is not
            a fraud, trust us
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
            Add Variant by Excel sheet .
          </Text>

          <Text mt="xs" color="dimmed" size="sm">
            Please click anywhere on this card to claim your reward, this is not
            a fraud, trust us
          </Text>
        </div>
      </Card>
    );
  };


  const mantineTheme = useMantineTheme();
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [uploadedSheet, setUploadedSheet] = useState(null);
  function updatePriceForm() {
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
          <FilePlus size={200} strokeWidth={0.4} color={"#407fbf"} />
          {
            
          }
          <div>
            <Text size="xl" inline>
              {uploadedSheet?`${uploadedSheet}`:`Click here to Browse excel.`}
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              
               {uploadedSheet?`Attached file successfully !`:` Attach excel sheet - with same format. for Update Price`}
             
            </Text>
          </div>
        </div>

        <Group
          style={{
            display: "flex",
            height: "20%",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 10,
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
              Download Sample Sheet
            </Button>
          </div>
          <div
            style={{
              width: "26%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              variant="light"
              color="red"
              type="reset"
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
              onClick={()=>{
                setUploadedSheet(null)
                setJsonData([])
              }}
            >
              Reset
            </Button>

            <Button variant="filled" type="button" onClick={handleJsonUploadForUpdatePrice}>
              Upload Excel Sheet
            </Button>
          </div>
        </Group>
      </div>
    );
  }
  function addVariantForm() {
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
          <FilePlus size={200} strokeWidth={0.4} color={"#407fbf"} />
          {
            
          }
          <div>
            <Text size="xl" inline>
              {uploadedSheet?`${uploadedSheet}`:`Click here to Browse excel.`}
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              
               {uploadedSheet?`Attached file successfully !`:` Attach excel sheet - with same format. Adding variants`}
             
            </Text>
          </div>
        </div>

        <Group
          style={{
            display: "flex",
            height: "20%",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 10,
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
              Download Sample Sheet
            </Button>
          </div>
          <div
            style={{
              width: "26%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              variant="light"
              color="red"
              type="reset"
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
              onClick={()=>{
                setUploadedSheet(null)
                setJsonData([])
              }}
            >
              Reset
            </Button>

            <Button variant="filled" type="button" onClick={handleJsonUploadForAddingVariant}>
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
              <Group position="apart">
                <Text className={classes.title}>Services</Text>
                <Anchor size="xs" color="dimmed" sx={{ lineHeight: 1 }}>
                  info
                </Anchor>
              </Group>
              <SimpleGrid cols={2} mt="md">
                {items}
              </SimpleGrid>

              {hoveredTabName == "update"
                ? updatePriceInfoCard()
                : addVariantInfoCard()}
            </>
          ) : selectedTabName == "update" ? (
            updatePriceForm()
          ) : (
            addVariantForm()
          )
          // formUpdate()
        }
      </Card>
    </div>
  );
}

export default SheetUpload;
