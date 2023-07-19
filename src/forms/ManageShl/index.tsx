import React, { useEffect } from "react";
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
      shlCharge: "",
      thc: "",
      blFee: "",
      surrender: "",
      convenienceFee: "",
      muc: "",
      seal: "",
      coo: "",
      key: randomId(),
    },
  ],
};

function EditShlForm(props: any) {
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

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
          <Grid.Col span={11}>
            <Select
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
              {form.values.destinations.length > 1 &&modalType !== "update" ?  (
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

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="SHL Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps(`destinations.${index}.shlCharge`)}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Convenience"
              placeholder="Eg. 26500"
              {...form.getInputProps(`destinations.${index}.convenienceFee`)}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="BL Fees"
              placeholder="Eg. 26500"             
              {...form.getInputProps(`destinations.${index}.blFee`)}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Surrender"
              placeholder="Eg. 26500"
              {...form.getInputProps(`destinations.${index}.surrender`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="MUC"
              placeholder="Eg. 26500"
              {...form.getInputProps(`destinations.${index}.muc`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="THC"
              placeholder="Eg. 26500"
              {...form.getInputProps(`destinations.${index}.thc`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Seal"
              placeholder="Eg. 26500"
              {...form.getInputProps(`destinations.${index}.seal`)}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="COO"
              placeholder="Eg. 26500"
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

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditShlForm;
