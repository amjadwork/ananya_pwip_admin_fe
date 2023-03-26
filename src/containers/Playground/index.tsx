import React from "react";
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

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

import EceForm from "./ECForm";

// import { packagingBags } from "../../constants/var.constants";

const RenderPageHeader = (props: any) => {
  // const activeFilter = props.activeFilter;
  // const handleRadioChange = props.handleRadioChange;

  return <PageHeader title="Export Costing" />;
};

const RenderPageAction = (props: any) => {
  const handleEdit = props.handleEdit;

  return (
    <ActionIcon
      variant="filled"
      color="gray"
      sx={{
        "&[data-disabled]": { opacity: 0.4 },
      }}
      onClick={() => {
        handleEdit(true);
      }}
    >
      <PlayerPlay size={16} />
    </ActionIcon>
  );
};

function PlaygroundContainer() {
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  // const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState(false);

  const handleEdit = (bool: boolean) => {
    setEditModeActive(bool);
  };

  return (
    <PageWrapper
      PageHeader={() => (
        <RenderPageHeader
          activeFilter={activeFilter}
          handleRadioChange={(value: any, index: number) =>
            setActiveFilter(index)
          }
        />
      )}
      PageAction={() => null}
    >
      <div style={{ width: "100%", height: "auto" }}>
        <EceForm />
      </div>
    </PageWrapper>
  );
}

export default PlaygroundContainer;
