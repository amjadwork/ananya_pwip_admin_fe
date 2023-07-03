import React, { useState, useEffect } from "react";
import { Group, NumberInput, Space, Grid, Box } from "@mantine/core";
import { Select, Button, ActionIcon } from "../../components/index";
import { Minus, Trash } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
  _originPortId: "",
  destinations: [
    {
      _destinationPortId: "",
      chaCharge: "",
      silicaGel: "",
      craftPaper: "",
      transportCharge: "",
      loadingCharge: "",
      customCharge: "",
      pqc: "",
      coo: "",
      key: randomId(),
    },
  ],
};

function EditChaForm(props: any) {
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  const handleAddItem: any = () => {
    form.insertListItem("destinations", initialFormValues.destinations[0], {
      ...initialFormValues.destinations[0],
    });
  };

  const handleFormSubmit = (formValues: typeof form.values) => {
    handleSaveAction(formValues); //update table UI
    handleCloseModal(false);
  };

  const fields = form.values.destinations.map((item: any, index: number) => (
    <React.Fragment key={item.key}>
      <Group
        spacing="md"
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[2]}`,
          borderRadius: 12,
          padding: 12,
          backgroundColor: theme.colors.gray[0],
        })}
      >
        <Grid>
          <Grid.Col span={11}>
            <Select
              defaultValue={item["_destinationPortId"]}
              required
              searchable
              label="Select Destination Port"
              placeholder="Eg. singapore"
              data={destinationSelectOptions}
              {...form.getInputProps(
                `destinations.${index}._destinationPortId`
              )}
            />
          </Grid.Col>

          <Grid.Col span={1}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
              }}
            >
              <Group spacing="md" position="right" margin-bottom="5px">
                <ActionIcon
                  color="red"
                  onClick={() => form.removeListItem("destinations", index)}
                >
                  <Trash size="1rem" />
                </ActionIcon>
              </Group>
            </div>
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="CHA Charges"
              placeholder="Eg. 26500"
              defaultValue={item["chaCharge"]}
              {...form.getInputProps(`destinations.${index}.chaCharge`)}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Silica Gel"
              placeholder="Eg. 26500"
              defaultValue={item["silicaGel"]}
              {...form.getInputProps(`destinations.${index}.silicaGel`)}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Craft Paper"
              placeholder="Eg. 26500"
              defaultValue={item["craftPaper"]}
              {...form.getInputProps(`destinations.${index}.craftPaper`)}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Transport Charge"
              placeholder="Eg. 26500"
              defaultValue={item["transportCharge"]}
              {...form.getInputProps(`destinations.${index}.transportCharge`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Loading Charge"
              placeholder="Eg. 26500"
              defaultValue={item["loadingCharge"]}
              {...form.getInputProps(`destinations.${index}.loadingCharge`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Custom Charge"
              placeholder="Eg. 26500"
              defaultValue={item["customCharge"]}
              {...form.getInputProps(`destinations.${index}.customCharge`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="PQC"
              placeholder="Eg. 26500"
              defaultValue={item["pqc"]}
              {...form.getInputProps(`destinations.${index}.pqc`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="COO"
              placeholder="Eg. 26500"
              defaultValue={item["coo"]}
              {...form.getInputProps(`destinations.${index}.coo`)}
            />
          </Grid.Col>
        </Grid>
      </Group>
      <Space h="md" />
    </React.Fragment>
  ));

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Select
        required
        searchable
        label="Select Origin Port"
        placeholder="Eg. chennai"
        data={regionSelectOptions}
        {...form.getInputProps("_originPortId")}
        sx={() => ({
          marginBottom: 18,
        })}
      />

      {fields}

      <Group
        sx={(theme) => ({
          borderRadius: 12,
          padding: 12,
          display: "flex",
          justifyContent: "flex-end",
        })}
      >
        <Box
          style={{
            textAlign: "right",
            width: "auto",
            color: "blue",
          }}
        >
          <div onClick={handleAddItem}>+ Add More</div>
        </Box>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Submit & Save</Button>
      </Group>
    </form>
  );
}

export default EditChaForm;
