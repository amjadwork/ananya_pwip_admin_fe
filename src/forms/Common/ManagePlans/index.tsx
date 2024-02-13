import React, { useEffect, useState } from "react";
import {
  Grid,
  NumberInput,
  Space,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Group,
  MultiSelect,
} from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";
import { applyMiddleware } from "redux";

const initialFormValues = {
  name: "",
  description: "",
  validity_type: "",
  validity: 0,
  applicable_services: [],
  applicable_for_users: [],
  refund_policy: false,
  show_to_user: false,
  usage_cap: 0,
  refund_policy_valid_day: 0,
  price: "",
  currency: "INR",
  is_free: false,
  is_unlimited: false,
};

function EditPlansForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const servicesData = props.servicesData;
  const usersData = props.usersData;
  const modalType = props.modalType || "add";

  const [applicableServices, setApplicableServices] = useState<string[]>([]);
  const [applicableUsers, setApplicableUsers] = useState<string[]>([]);
  const [refundError, setRefundError] = useState<string | null>(null);
  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
    validate: {
      applicable_services: (value: any) =>
        value.length < 1 ? "Add applicable services from the list" : null,
    },
  });

  const validityType = [
    { value: "days", label: "Days" },
    { value: "hours", label: "Hours" },
    { value: "usage_cap", label: "Usage Cap" },
  ];

  const servicesOptions = servicesData
    .filter((option: any) => option.active === 1)
    .map((list: any) => ({
      value: list.id,
      label: list.name,
    }));

  const usersOptions = usersData
    .filter((option: any) => option.active === 1)
    .map((list: any) => ({
      value: list._id,
      label: `${list.email} | ${list.full_name} `,
    }));

  const handleServiceChange = (newServiceValues: string[]) => {
    setApplicableServices(newServiceValues);
    form.setValues((prevValues: any) => ({
      ...prevValues,
      applicable_services: newServiceValues,
    }));
  };

  const handleUserChange = (newUserValues: string[]) => {
    setApplicableUsers(newUserValues);
    form.setValues((prevValues: any) => ({
      ...prevValues,
      applicable_for_users: newUserValues,
    }));
  };

  //to show previous values while editing the row
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      const updatedFormData = {
        ...updateFormData,
        price: parseFloat(updateFormData.price),
      };
      setApplicableServices(updatedFormData.applicable_services || []);
      setApplicableUsers(updatedFormData.applicable_for_users || []);
      form.setValues(updatedFormData);
    }
  }, [updateFormData, modalType]);

  useEffect(() => {
    if (
      form.values.validity_type === "days" &&
      form.values.validity > 0 &&
      form.values.refund_policy_valid_day >= form.values.validity
    ) {
      setRefundError("Refund validity cannot exceed plan validity");
      return;
    } else if (
      form.values.refund_policy &&
      form.values.refund_policy_valid_day === 0
    ) {
      setRefundError("Refund validity cannot be zero");
      return;
    } else {
      setRefundError(null);
    }
  }, [form.values]);

  console.log(form.values, "values")
  const handleFormSubmit = (formValues: typeof form.values) => {
    if (formValues.price === 0) {
      form.values.refund_policy = false;
      form.values.refund_policy_valid_day = 0;
    }
    if (formValues.is_free === true)
    {
      formValues.is_free = 1;
    }
    if (formValues.is_unlimited === true) {
          formValues.is_unlimited = 1;
    }
    else {
      formValues.is_unlimited = 0;
        formValues.is_free = 0;
    }
    
    console.log(formValues, "formValues")
    setRefundError(null);
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
            label="Name of Plan"
            placeholder="eg. EXIM Data Plan-399"
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            placeholder="Write here"
            label="Description(optional)"
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <Grid.Col span={4} mt="sm">
          <Checkbox
            label="Is Free?"
            size="sm"
            checked={form.values.is_free}
            onChange={(event) => {
              form.getInputProps("is_free").onChange(event);
            }}
          />
        </Grid.Col>
        <Grid.Col span={4} mt="sm">
          <Checkbox
            label="Is Unlimited?"
            size="sm"
            checked={form.values.is_unlimited}
            onChange={(event) => {
              form.getInputProps("is_unlimited").onChange(event);
            }}
          />
        </Grid.Col>
        <Grid.Col span={4} mt="sm">
          <Checkbox
            label="Show To Users"
            size="sm"
            checked={form.values.show_to_user}
            onChange={(event) => {
              form.getInputProps("show_to_user").onChange(event);
            }}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <MultiSelect
            data={usersOptions}
            required
            label="Applicable for Users"
            placeholder="Select Applicable Users"
            value={applicableUsers}
            onChange={handleUserChange}
            clearButtonLabel="Clear selection"
            clearable
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <MultiSelect
            data={servicesOptions}
            required
            label="Applicable Services"
            placeholder="Select Applicable Services"
            value={applicableServices}
            onChange={handleServiceChange}
            error={form.errors.applicable_services}
            clearButtonLabel="Clear selection"
            clearable
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            required
            label="Price"
            placeholder="eg. 599.00"
            precision={2}
            hideControls
            {...form.getInputProps("price")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            required
            hideControls
            label="Validity Type"
            data={validityType}
            placeholder="eg. days"
            {...form.getInputProps("validity_type")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Usage Limit"
            required={form.values.validity_type === "usage_cap"}
            hideControls
            {...form.getInputProps("usage_cap")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            required
            label="Valid for (in hours or days)"
            disabled={
              form.values.validity_type === "" ||
              form.values.validity_type === "usage_cap"
            }
            placeholder="eg. 30 days"
            hideControls
            {...form.getInputProps("validity")}
          />
        </Grid.Col>
        <Grid.Col span={12} mt="sm">
          <Checkbox
            label="Refund Policy Applicable"
            size="sm"
            checked={form.values.refund_policy}
            disabled={form.values.price === "" || form.values.price === 0}
            onChange={(event) => {
              if (!event.currentTarget.checked) {
                setRefundError(null);
              }
              form.getInputProps("refund_policy").onChange(event);
            }}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <NumberInput
            required
            hideControls
            label="Refundable for (in days)"
            placeholder="eg. 7 days"
            disabled={
              !form.values.refund_policy ||
              form.values.price === "" ||
              form.values.price === 0
            }
            {...form.getInputProps("refund_policy_valid_day")}
          />
          {refundError && (
            <div style={{ color: "red", fontSize: "12px" }}>{refundError}</div>
          )}
        </Grid.Col>
      </Grid>

      <Space h="sm" />
      <Group position="right" mt="md" spacing="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditPlansForm;
