import React, { useEffect } from "react";
import { Group, NumberInput, Space, Grid, Box } from "@mantine/core";
import { Select, Button, ActionIcon } from "../../components/index";
import { Trash } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
  _originPortId: "",
  sourceLocations: [
    {
      _sourcePortId: "",
      transportationCharge: "",
      key: randomId(),
    },
  ],
};

function EditTransportationForm(props: any) {
  const originSelectOptions = props.originSelectOptions;
  const sourceSelectOptions = props.sourceSelectOptions;
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
    form.insertListItem("sourceLocations", initialFormValues.sourceLocations[0], {
      ...initialFormValues.sourceLocations[0],
    });
  };

  //to remove the destination item in the form modal
  const handleRemoveItem: any = (index: number) => {
        form.removeListItem("sourceLocations", index);
      };

  const handleFormSubmit = (formValues: typeof form.values) => {
    handleSaveAction(formValues);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

 const fields = form.values.sourceLocations.map((item: any, index: number) => (
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
          <Grid>
            <Grid.Col span={6}>
              <Select
                required
                searchable
                label="Select Source "
                placeholder="Eg. Karnal"
                data={sourceSelectOptions}
                {...form.getInputProps(
                  `sourceLocations.${index}._sourcePortId`
                )}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <NumberInput
                required
                precision={2}
                hideControls
                label="Transportation Charge"
                placeholder="Eg. 26500"
                {...form.getInputProps(`sourceLocations.${index}.transportationCharge`)}
              />
            </Grid.Col>
          </Grid>
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
            {form.values.sourceLocations.length > 1 && modalType !== "update" ? (
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
        placeholder="Eg. Chennai"
        data={originSelectOptions}
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
            padding: 2,
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

export default EditTransportationForm;
