import React, { useEffect } from "react";
import { Group, NumberInput, Space, TextInput, MultiSelect, Select} from "@mantine/core";
import { Button} from "../../components/index";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

const initialFormValues = {
    typeOfCharge: "",
    typeOfValue: "",
    applicableFor:"",
    value: "",
    key: randomId(),
};

function EditOtherChargesForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions=props.variantSelectOptions;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  const TypeOfValue=[
    { value: 'flat', label: 'Flat' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed' },
  ]


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
            placeholder="eg. Export Duty"
            disabled={modalType === "update" ? true : false}
            {...form.getInputProps("typeOfCharge")}
          />
    
          <Space h="sm" />

          <Select
            required
            hideControls
            label="Type of Value"
            data={TypeOfValue}
            placeholder="eg. percentage"
            disabled={modalType === "update" ? true : false}
            {...form.getInputProps("typeOfValue")}
          />

          <Space h="sm" />

         <MultiSelect
            data={variantSelectOptions || []}
            label="Applicable For (Select Variant/s)"
            placeholder="eg. 1509 Basmati Steam"
            {...form.getInputProps("applicableFor")}
            
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
