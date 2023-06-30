import React, { useState, useEffect } from "react";
import { Group, NumberInput, Space, Grid, Box } from "@mantine/core";
import { Select, Button, ActionIcon } from "../../components/index";
import { Minus} from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

const initialFormValues = {
  "_originPortId_|": "",
  "_destinationPortId_|": "",
  "chaCharge_|": "",
  "silicaGel_|": "",
  "craftPaper_|": "",
  "transportCharge_|": "",
  "loadingCharge_|": "",
  "customCharge_|": "",
  "pqc_|": "",
  "coo_|": "",
};

function EditChaForm(props: any) {
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleUpdateChaUIData = props.handleUpdateChaUIData;

  const [chaDestinationItemList, setChaDestinationItemList] = useState([]);
  const [chaPayload, setChaPayload] = useState(null);
  const [chaFormValues, setChaFormValues] = useState({ ...initialFormValues });

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: chaFormValues,
  });
  const handleAddItem: any = () => {
    const object: any = { ...form.values };
    const originPortId = object["_originPortId_|"];


    let destinationsArr: any = [...chaDestinationItemList];
    let destinationObject: any = {};

    Object.keys(object)
      .filter((key) => {
        const _key = key.split("_|")[0];
        if (_key !== "_originPortId") {
          return key;
        }
      })
      .map((key) => {
        const _key = key.split("_|")[0];
        destinationObject[_key] = object[key];
        return {
          [_key]: object[key],
        };
      });
    destinationsArr.push(destinationObject);
    console.log("dArr", destinationsArr)

    const payloadObject: any = {
      _originPortId: originPortId,
      destinations: [...destinationsArr],
    };
    setChaPayload(payloadObject);
    console.log("payloadObject", payloadObject)
  
    const formResetValues = {
      ...initialFormValues,
      "_originPortId_|": originPortId, 
    };
    form.setValues({
      ...formResetValues,
    });
    console.log("chapayload", chaPayload)
    console.log("reset", formResetValues)


    setChaFormValues(formResetValues);
    // setChaPayload(payloadObject);
    setChaDestinationItemList(destinationsArr);
  };

  const handleDeleteItem = (index: number) => {
    let destinationsArr: any = [...chaDestinationItemList];
    // logic to delete an item starts
    if (index > -1) {
      destinationsArr.splice(index, 1);
    }
    // logic to delete an item end
    setChaDestinationItemList(destinationsArr);
  };

  // const handleUpdate = (index: number) => {
  //   const arr: any = [...chaDestinationItemList];
  //   arr[index] = catUpdateValue;

  //   setChaDestinationItemList(arr);

  //   console.log(arr);
  // };

  const handleFormSubmit = (formValues: typeof form.values) => {
    let destinationObject: any = {};
    const object: any = { ...formValues };
    const originPortId = object["_originPortId_|"];
    let destinationsArr: any = [...chaDestinationItemList];

    Object.keys(object)
      .filter((key) => {
        const _key = key.split("_|")[0];
        if (_key !== "_originPortId") {
          return key;
        }
      })
      .map((key) => {
        const _key = key.split("_|")[0];
        destinationObject[_key] = object[key];
        return {
          [_key]: object[key],
        };
      });

    destinationsArr.push(destinationObject);

    const payloadObject: any = {
      _originPortId: originPortId,
      destinations: [...destinationsArr],
    };
    setChaDestinationItemList(destinationsArr);
    handleUpdateChaUIData(payloadObject); //update table UI
    handleCloseModal(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Select
        required
        searchable
        label="Select Origin Port"
        placeholder="Eg. chennai"
        data={regionSelectOptions}
        {...form.getInputProps("_originPortId_|")}
        sx={() => ({
          marginBottom: 18,
        })}
      />

      <Space h="md" />
      {chaDestinationItemList.map((item, i) => {
        return (
          <React.Fragment key={i}>
            <Group
              spacing="md"
              sx={(theme) => ({
                border: `1px solid ${theme.colors.gray[2]}`,
                borderRadius: 12,
                padding: 12,
                backgroundColor: theme.colors.gray[0],
              })}>
              <Grid>
                <Grid.Col span={11}>
                  <Select
                    defaultValue={item["_destinationPortId"]}
                    required
                    searchable
                    label="Select Destination Port"
                    placeholder="Eg. singapore"
                    data={destinationSelectOptions}
                    {...form.getInputProps("_destinationPortId_|" + i)}
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
                    }}>
                    <Group spacing="md" position="right" margin-bottom="5px">
                      <ActionIcon
                        variant="filled"
                        onClick={() => handleDeleteItem(i)}>
                        <Minus size={20} />
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
                    {...form.getInputProps("chaCharge_|" + i)}
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
                    {...form.getInputProps("silicaGel_|" + i)}
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
                    {...form.getInputProps("craftPaper_|" + i)}
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
                    {...form.getInputProps("transportCharge_|" + i)}
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
                    {...form.getInputProps("loadingCharge_|" + i)}
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
                    {...form.getInputProps("customCharge_|" + i)}
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
                    {...form.getInputProps("pqc_|" + i)}
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
                    {...form.getInputProps("coo_|" + i)}
                  />
                </Grid.Col>
              </Grid>
            </Group>
            <Space h="md" />
          </React.Fragment>
        );
      })}

      <Group
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[2]}`,
          borderRadius: 12,
          padding: 12,
        })}>
        <Grid>
          <Grid.Col span={12}>
            <Select
              searchable
              label="Select Destination Port"
              placeholder="Eg. singapore"
              data={destinationSelectOptions}
              {...form.getInputProps("_destinationPortId_|")}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="CHA Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("chaCharge_|")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="Silica Gel"
              placeholder="Eg. 26500"
              {...form.getInputProps("silicaGel_|")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="Craft Paper"
              placeholder="Eg. 26500"
              {...form.getInputProps("craftPaper_|")}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="Transport Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("transportCharge_|")}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="Loading Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("loadingCharge_|")}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="Custom Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("customCharge_|")}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="PQC"
              placeholder="Eg. 26500"
              {...form.getInputProps("pqc_|")}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              precision={2}
              hideControls
              label="COO"
              placeholder="Eg. 26500"
              {...form.getInputProps("coo_|")}
            />
          </Grid.Col>
        </Grid>
        <Box
          style={{
            textAlign: "right",
            width: "100%",
            color: "blue",
          }}>
          <div onClick={handleAddItem}>+ Add More</div>
        </Box>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditChaForm;
