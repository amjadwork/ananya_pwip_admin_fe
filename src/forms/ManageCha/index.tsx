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
        chaCharge: "",
        silicaGel: "",
        craftPaper: "",
        serviceCharge:"",
        fumigationCharge:"",
        transportCharge: "",
        loadingCharge: "",
        customCharge: "",
        pqc: "",
        coo: "",
        key: randomId(),
      },
    ],
  };


function calculateTotalCharge(destinations:any) {
  return destinations.reduce((total:any, destination:any) => {
    const {
      silicaGel = 0,
      craftPaper = 0,
      transportCharge = 0,
      loadingCharge = 0,
      customCharge = 0,
      serviceCharge=0,
      fumigationCharge=0,
      pqc = 0,
      coo = 0,
    } = destination;

  const charges = [
    parseFloat(silicaGel),
    parseFloat(craftPaper),
    parseFloat(transportCharge),
    parseFloat(loadingCharge),
    parseFloat(customCharge),
    parseFloat(serviceCharge),
    parseFloat(fumigationCharge),
    parseFloat(pqc),
    parseFloat(coo),
  ];

  const destinationTotal = charges.reduce((acc, charge) => acc + (isNaN(charge) ? 0 : charge), 0);

  return total + destinationTotal;
}, 0);
}

function EditChaForm(props: any) {
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
      

      const handleFormSubmit = async (formValues: typeof form.values) => {
        const updateChaCharge = formValues.destinations.map((destination: any) => {
          const destinationTotal = calculateTotalCharge([destination]);
          return {
            ...destination,
            chaCharge: destinationTotal,
          };
        });
      
        const formData = { ...formValues, destinations: updateChaCharge };
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
              data={destinationOptions}
              disabled={modalType === "update" ? true : false}
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

          <Grid.Col span={11}>
            <NumberInput
              required
              disabled
              precision={2}
              hideControls
              label="Total CHA Charge"
              value={calculateTotalCharge([form.values.destinations[index]])}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Silica Gel"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.silicaGel`)}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Craft Paper"
              placeholder="eg. 500.00"            
              {...form.getInputProps(`destinations.${index}.craftPaper`)}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Transport Charge"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.transportCharge`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Loading Charge"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.loadingCharge`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Custom Charge"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.customCharge`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="PQC"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.pqc`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="COO"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.coo`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              required
              precision={2}
              hideControls
              label="Service Charge"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.serviceCharge`)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              precision={2}
              hideControls
              label="Fumigation Charge"
              placeholder="eg. 500.00"
              {...form.getInputProps(`destinations.${index}.fumigationCharge`)}
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

export default EditChaForm;
