import React, { useState } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { manageCha } from "../../../constants/var.constants";

function EditChaForm(props: any) {
  const [categoriesValue, setCategoriesValue] = useState("");
  const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [regUpdateValue,setRegUpdateValue]=useState("");
  const [numUpdateValue,setNumUpdateValue]=useState("");

  const [allValue, setAllValue] = useState({});
  const handleCloseModal=props.handleCloseModal;

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      // name: "",
      originPort:"",
      // category: "",
      // city: "",
      // state: "",
      destination:"",
      chaPrice:"",
      // exmill: "",
      // transportation: "",
    },

    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    // },
  });

  const handleClick: any = () => {
    const arr: any = [...categoriesList];
    arr.push(categoriesValue);
    console.log(arr);
    setCategoriesList(arr);
  };

  const handleDeleteItem = (index: number) => {
    const arr: any = [...categoriesList];

    // logic to delete an item starts
    if (index > -1) {
      arr.splice(index, 1);
    }

    // logic to delete an item end

    setCategoriesList(arr);
    console.log(arr);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };
  const handleUpdate = (index: number) => {
    const arr: any = [...categoriesList];
    arr[index] = catUpdateValue;

    setCategoriesList(arr);

    console.log(arr);
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log(values, "values");
    handleCloseModal(false);

  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        required
        label="Enter Origin Port"
        placeholder="Eg. chennai"
        {...form.getInputProps("originPort")}
      />
 
      <Space h="md" />
      {categoriesList.map((k, i) => {
        return (
          <Group spacing="md" key={i}>
            <TextInput
              required
              label="Enter Destination Port"
              placeholder="Eg. singapore"
              // data={[]}
              onChange={(e: any) =>{ 
                console.log();
                setRegUpdateValue(e.target.value)}}
              // {...form.getInputProps("destination")}
            />

            <NumberInput
              required
              label="Enter CHA Charges"
              placeholder="Eg. 26500"
              onChange={(e: any) => setNumUpdateValue(e.target.value)}

              // {...form.getInputProps("cha")}
            />
            

            
            <div
              style={{
                display: "inline-flex",
                alignItems: "bottom",
                // width: "100%",
                marginTop: `3%`,
              }}
            >
              <Group spacing="md" position="right" margin-bottom="5px">
                <ActionIcon
                  variant="filled"
                  onClick={() => handleDeleteItem(i)}
                >
                  <Minus size={20} />
                </ActionIcon>
              </Group>
            </div>
            {/* <Grid.Col span={2}> */}

            <NumberInput
              required
              label="Silica Gel"
              placeholder="Eg. 26500"
              onChange={(e: any) => setNumUpdateValue(e.target.value)}

              // {...form.getInputProps("silica")}
            />
             {/* </Grid.Col> */}

            <Grid>
            
            <Grid.Col span={2}>
            <NumberInput
              required
              label="Craft Paper"
              placeholder="Eg. 26500"
              onChange={(e: any) => setNumUpdateValue(e.target.value)}

              // {...form.getInputProps("craft")}
            />
            </Grid.Col>
              
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="Transport Charge"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("transportation")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="Loading Charge"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("loading")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="Custom Charge"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("custom")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="PQC"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("pqc")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="COO"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("coo")}
                />
              </Grid.Col>
            </Grid>
          </Group>
        );
      })}

      <Space h="md" />

      <Group>
      {/* <Grid.Col span={3}> */}
        <TextInput
          required
          label="Enter Destination port"
          placeholder="Eg. Karnal"
          data={[]}
          {...form.getInputProps("destination")}
        />
         {/* </Grid.Col> */}
         {/* <Grid.Col span={3}> */}
        <NumberInput
          required
          label="Enter CHA Charges"
          placeholder="Eg. 26500"
          {...form.getInputProps("cha")}
        />
        {/* </Grid.Col> */}
        
       
        <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            // width: "100%",
            marginTop: `3%`,
          }}
        >
          <Button onClick={handleClick}>+</Button>
        </div>
        <NumberInput
          required
          label="Silica Gel"
          placeholder="Eg. 26500"
          {...form.getInputProps("silica")}
        />

        <Grid>
        <Grid.Col span={2}>
        <NumberInput
          required
          label="Craft Paper"
          placeholder="Eg. 26500"
          {...form.getInputProps("craft")}
        /></Grid.Col>
        <Grid.Col span={2}>
            <NumberInput
              required
              label="Transport Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("transportation")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Loading Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("loading")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Custom Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("custom")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="PQC"
              placeholder="Eg. 26500"
              {...form.getInputProps("pqc")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="COO"
              placeholder="Eg. 26500"
              {...form.getInputProps("coo")}
            />
          </Grid.Col>
        </Grid>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditChaForm;
