import React, { useEffect } from "react";
import { Grid, Space, TextInput,Group} from "@mantine/core";
import { Button} from "../../../components/index";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
    tagName: "",
    key: randomId(),
};

function EditTagsForm(props: any) {
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


  const handleFormSubmit = (formValues: typeof form.values) => {
    handleSaveAction(formValues);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

      return (
        <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Grid gutter="sm">
          <Grid.Col span={12}>
            <TextInput
              required
              label="Enter Tag Name"
              placeholder="eg. exporter"
              {...form.getInputProps("tagName")}
            />
          </Grid.Col>
        </Grid>
        <Space h="sm" />
        <Group position="right" mt="md" spacing="md">
            <Button type="submit">Submit</Button>
          </Group>
      </form>
      );
    }

export default EditTagsForm;
