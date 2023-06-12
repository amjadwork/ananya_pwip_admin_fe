import React from "react";

import {
  Card as CardComponent,
  Image,
  Text,
  Badge,
  Button,
  Group,
  useMantineTheme,
} from "@mantine/core";

import { useStyles } from "../../../styles/components/header.style";

interface Props {
  title: string;
  status?: string;
  onClickAction?: any;
}

const Card: React.FC<Props> = ({ title, status, onClickAction }) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  return (
    <CardComponent
      shadow="sm"
      p="lg"
      radius="md"
      component="a"
      style={{ cursor: onClickAction ? "pointer" : "default" }}
      withBorder
      onClick={onClickAction ? onClickAction : () => null}
    >
      <CardComponent.Section>
        <Image
          src="https://images.unsplash.com/photo-1592997572594-34be01bc36c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          height={160}
          alt="Norway"
        />
      </CardComponent.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        {status && (
          <Badge color="green" variant="light">
            {status}
          </Badge>
        )}
      </Group>
    </CardComponent>
  );
};

export default Card;
