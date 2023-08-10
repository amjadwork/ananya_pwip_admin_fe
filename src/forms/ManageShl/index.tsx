import React, { useState, useEffect } from "react";
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
      shlCharge: "",
      thc: "",
      blFee: "",
      surrender: "",
      convenienceFee: "",
      muc: "",
      seal: "",
      key: randomId(),
    },
  ],
};

function calculateTotalCharge(destinations:any) {
  return destinations.reduce((total:any, destination:any) => {
    const {
      thc = 0,
      blFee = 0,
      surrender = 0,
      convenienceFee = 0,
      muc = 0,
      seal = 0,
    } = destination;

    const charges = [
    parseFloat(thc),
    parseFloat(blFee),
    parseFloat(surrender),
    parseFloat(convenienceFee),
    parseFloat(muc),
    parseFloat(seal),
  ];
  
    const destinationTotal = charges.reduce((acc, charge) => acc + (isNaN(charge) ? 0 : charge), 0);

  return total + destinationTotal;
}, 0);
}

function EditShlForm(props: any) {
  const originSelectOptions = props.originSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const containerSelectOptions=props.containerSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues},
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

  //updating the value totalShlCharge in respective key and updating the form
  const handleFormSubmit = async (formValues: typeof form.values) => {
    const total = calculateTotalCharge(formValues.destinations);
    const updateShlCharge = formValues.destinations.map((destination: any) => ({
      ...destination,
      shlCharge: total,
    }));     
    const formData = { ...formValues, destinations: updateShlCharge };
    await handleSaveAction(formData);
    form.setValues(initialFormValues);
    handleCloseModal(false);
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
              disabled={modalType === "update" ? true : false}
              data={destinationSelectOptions}
              {...form.getInputProps(
                `destinations.${index}._destinationPortId`
              )}
            />
          </Grid.Col>

          <Grid.Col span={11}>
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
              disabled
              precision={2}
              hideControls
              label="SHL Charges"
              placeholder="Eg. 26500"
              value={calculateTotalCharge([form.values.destinations[index]])}
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

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditShlForm;

