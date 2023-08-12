import React, { useEffect, useState } from "react";
import { Group, NumberInput, Space, Grid, Box } from "@mantine/core";
import { Select, Button, ActionIcon } from "../../components/index";
import { Trash } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
  _originPortId: "",
  destinations: [
    {
      _destinationPortId: "",
      _containerId:"",
      ofcCharge: "",
      key: randomId(),
    },
  ],
};

function EditOfcForm(props: any) {
  const originSelectOptions = props.originSelectOptions;
  const containerSelectOptions=props.containerSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";
  const { handleGetDestinationDataByOrigin } = props;
  const [destinationOptions, setDestinationOptions] = useState<any>([]);

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  //to show previous values while editing the row
  useEffect(() => {
  if (updateFormData && modalType === "update") {
    form.setValues(updateFormData);
  }
}, [updateFormData, modalType]);

  //to add more destination item in the form
  const handleAddItem: any = () => {
    form.insertListItem("destinations", initialFormValues.destinations[0], {
      ...initialFormValues.destinations[0],
    });
  };

  //to remove the destination item in the form modal
  const handleRemoveItem: any = (index: number) => {
        form.removeListItem("destinations", index);
      };

  //getting destination port list based on selected origin Port
  useEffect(() => {
    const fetchDestinationOptions = async () => {
      if (form.values._originPortId) {
        try {
          const response = await handleGetDestinationDataByOrigin(form.values._originPortId);
          setDestinationOptions(response);
        } catch (error) {
          console.error("Error fetching destination data:", error);
        }
      }
    };
    fetchDestinationOptions();
  }, [form.values._originPortId]);

  const handleFormSubmit = (formValues: typeof form.values) => {
    handleSaveAction(formValues);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

 const fields = form.values.destinations.map((item: any, index: number) => (
  <React.Fragment key={item?.key}>
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
        <Grid.Col span={10}>
          <Grid>
            <Grid.Col span={6}>
              <Select
                required
                searchable
                label="Select Destination Port"
                placeholder="eg. Singapore"
                data={destinationOptions}
                disabled={modalType === "update" ? true : false}
                {...form.getInputProps(
                  `destinations.${index}._destinationPortId`
                )}
              />
            </Grid.Col>

            <Grid.Col span={6}>
            <Select
              required
              searchable
              label="Select Container Type"
              placeholder="eg. Standard Dry"
              data={containerSelectOptions}
              disabled={modalType === "update" ? true : false}
              {...form.getInputProps(
                `destinations.${index}._containerId`
              )}
            />
          </Grid.Col>
            
            <Grid.Col span={12}>
              <NumberInput
                required
                precision={2}
                hideControls
                label="OFC Charges"
                placeholder="Eg. 26500"
                {...form.getInputProps(`destinations.${index}.ofcCharge`)}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>

        <Grid.Col span={2}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              width: "100%",
              height: "100%",
            }}
          >
            {form.values.destinations.length > 1 && modalType !== "update" ? (
              <Group spacing="md" position="right" margin-bottom="5px">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => handleRemoveItem(index)}
                >
                  <Trash size="1rem" />
                </ActionIcon>
              </Group>
            ) : null}
          </div>
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
        placeholder="eg. Chennai"
        data={originSelectOptions}
        disabled={modalType === "update" ? true : false}
        {...form.getInputProps("_originPortId")}
        sx={() => ({
          marginBottom: 18,
        })}
      />

      {fields}

      {modalType === "add" ? (
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
      ) : null}

      <Group position="right" mt="sm">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditOfcForm;
