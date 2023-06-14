import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Flex,
} from "@mantine/core";

import {Button} from "../../components/index"
// import { Pencil, X, Check,PlayerPlay} from "tabler-icons-react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

import EceForm from "../../forms/Playground/index";
import moment from "moment";

// import { packagingBags } from "../../constants/var.constants";

const RenderPageHeader = (props: any) => {
  return <PageHeader title="Playground" />;
};

function PlaygroundContainer() {
  const [opened, { open, close }] = useDisclosure(false);

  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [printData, setPrintData] = React.useState<any>(null);

  const handleExportPlayground = (data: any) => {
    setPrintData(data);
    open();
  };

  function printDocument() {
    let input: any = document.getElementById("divToPrint");
    input.style = "display: block; padding: 24px; max-height: 100%;";

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      let pdf: any = new jsPDF("p", "pt", "letter");
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`ec-${moment(new Date()).format("DD-MM-YYYY HH-mm")}.pdf`);
    });
    close();
    // window.location.href = window.location.pathname;
  }

  return (
    <PageWrapper
      PageHeader={() => <RenderPageHeader />}
      PageAction={() => null}
    >
      <EceForm handleExportPlayground={handleExportPlayground} />

      <Modal
        opened={opened}
        onClose={close}
        title="PWIP Export Costing"
        // centered
        size="70%"
      >
        <div
          id="divToPrint"
          style={{
            display: "block",
            padding: 24,
            maxHeight: `calc(100vh - 210px)`,
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {printData &&
              Object.keys(printData).map((key: any, index: number) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: "100%",
                      borderBottom: "1px solid #e3e3e3",
                      padding: `4px 12px`,
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minWidth: 200,
                      }}
                    >
                      <span>{key}:</span>
                    </div>
                    <span style={{ marginLeft: 12 }}>
                      {printData[key] || "-"}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        <Flex
          gap="md"
          justify="flex-end"
          align="center"
          direction="row"
          wrap="wrap"
          w="100%"
        >
          <Button
            size="xs"
            color="blue"
            type="button"
            onClick={printDocument}
            disabled={!printData}
          >
            Download
          </Button>
        </Flex>
      </Modal>
    </PageWrapper>
  );
}

export default PlaygroundContainer;
