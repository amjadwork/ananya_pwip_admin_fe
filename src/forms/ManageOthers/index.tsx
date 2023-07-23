import React, { useEffect } from "react";
import { Group, NumberInput, Space, TextInput} from "@mantine/core";
import { Button} from "../../components/index";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
    typeOfCharge: "",
    typeOfValue: "",
    value: "",
    key: randomId(),
};

function EditOtherChargesForm(props: any) {
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
          <TextInput
            required
            label="Type of Charge"
            placeholder="Eg. export duty"
            {...form.getInputProps("typeOfCharge")}
          />
    
    <Space h="sm" />

    <TextInput
            required
            hideControls
            label="Type of Charge"
            placeholder="eg. percentage"
            {...form.getInputProps("typeOfValue")}
          />
    
          <Space h="sm" />
    
          <NumberInput
            required
            hideControls
            label="Value"
            placeholder="eg. 20"
            {...form.getInputProps("value")}
          />
    
          <Group position="right" mt="md" spacing="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      );
    }

export default EditOtherChargesForm;
