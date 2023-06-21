import React from 'react';
import {
  SimpleGrid,
  Box,
  Space,
  Title,
  List,
  ScrollArea,
} from "@mantine/core";
import {Card as SectionCard} from "../index";


interface CardModalProps {
  chaData: any[];
  destinationSelectOptions: any[];
}

const CardModal = (props: CardModalProps) => {
  const { chaData, destinationSelectOptions } = props;

return(
  <SimpleGrid cols={2}>
        {chaData.map((item: any, index: number) => {
          return (
            <SectionCard
              key={index}
              withBorder
              radius="md"
              p="lg"
              component="a"
            >
              <Title order={3}>{item?.name}</Title>
              <Space h="xl" />
              <ScrollArea
                scrollbarSize={2}
                style={{ maxHeight: 380, height: 360 }}
              >
                <List type="ordered" spacing="lg">
                  {item?.list?.map((d: any, i: number) => {
                    const destinationName = destinationSelectOptions.find(
                      (f: any) => f.value === d._destinationPortId
                    )?.label;
                    return (
                      <Box
                        key={i}
                        sx={(theme: any) => ({
                          display: "block",
                          backgroundColor:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[6]
                              : "#fff",
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[4]
                              : theme.colors.dark[7],
                          textAlign: "left",
                          padding: theme.spacing.md,
                          borderRadius: theme.radius.md,
                          cursor: "default",

                          "&:hover": {
                            backgroundColor:
                              theme.colorScheme === "dark"
                                ? theme.colors.dark[5]
                                : theme.colors.gray[1],
                          },
                        })}
                      >
                        <List.Item>
                          {destinationName} -{" "}
                          <span style={{ fontWeight: "800" }}>
                            INR {d.chaCharge}
                          </span>
                        </List.Item>
                      </Box>
                    );
                  })}
                </List>
              </ScrollArea>
            </SectionCard>
          );
        })}
      </SimpleGrid>
);
 };

export default CardModal;
