import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";

import {
  // SimpleGrid,
  // Box,
  ActionIcon,
  // Group,
  // Popover,
  // Text,
  // Button,
  // Space,
  // Title,
  // Badge,
  // Card as SectionCard,
  // List,
  // ScrollArea,
} from "@mantine/core";
import {
  // Pencil, X, Check,
  PlayerPlay,
} from "tabler-icons-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

import EceForm from "./ECForm";
import moment from "moment";

// import { packagingBags } from "../../constants/var.constants";

const RenderPageHeader = (props: any) => {
  return <PageHeader title="Playground" />;
};

function PlaygroundContainer() {
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [printData, setPrintData] = React.useState<any>(null);

  const handleExportPlayground = (data: any) => {
    setPrintData(data);
  };

  function printDocument() {
    const input: any = document.getElementById("divToPrint");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      let pdf: any = new jsPDF("p", "pt", "letter");
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`ec-${moment(new Date()).format("DD-MM-YYYY HH-mm")}.pdf`);
    });
  }

  useEffect(() => {
    if (printData && Object.keys(printData).length) {
      printDocument();
    }
  }, [printData]);

  return (
    <PageWrapper
      PageHeader={() => <RenderPageHeader />}
      PageAction={() => null}
    >
      <EceForm handleExportPlayground={handleExportPlayground} />

      <div id="divToPrint" style={{ display: "block", padding: 24 }}>
        <div>PWIP Export Costing</div>

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
                  }}
                >
                  <span>{key}:</span>
                  <span style={{ marginLeft: 12 }}>
                    {printData[key] || "-"}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </PageWrapper>
  );
}

export default PlaygroundContainer;
