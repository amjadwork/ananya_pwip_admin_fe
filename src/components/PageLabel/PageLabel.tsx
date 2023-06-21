import React from 'react';
import { Box, Group, Title } from "@mantine/core";
import { Button, Input } from "../../components/index";
import { Plus } from "tabler-icons-react";

interface Props {
  editModeActive: boolean;
  setModalOpen: (open: boolean) => void;
  title?: string;
}

const PageLabel: React.FC<Props> = ({ editModeActive, setModalOpen, title }) => {
  return (
    <Box
      sx={(theme: any) => ({
        display: "block",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[1],
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.dark[7],
        textAlign: "center",
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        cursor: "default",
      })}
    >
      <Group position="apart">
        {title && <Title order={1}>{title}</Title>}
        <Group spacing="md">
          <Input placeholder="Search" />
          {editModeActive && (
            <Button
              type="submit"
              leftIcon={<Plus size={14} />}
              onClick={() => setModalOpen(true)}
            >
              Add
            </Button>
          )}
        </Group>
      </Group>
    </Box>
  );
};

export default PageLabel;
