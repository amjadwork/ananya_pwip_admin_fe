import React, { useState } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  ActionIcon,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { riceCategory } from "../../../constants/var.constants";

function EditProductForm(props: any) {
  const [categoriesValue, setCategoriesValue] = useState("");
  const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  const [allValue, setAllValue] = useState({});

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: "",
      category: "",
      city: "",
      state: "",
      // destination: "",
      exmill: "",
      // transportation: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
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
    let arr: any = [];

    if (values.category === "Basmati") {
      arr = [...riceCategory[0].list];
      arr.push(values);
      console.log("arr 1", arr);
    } else {
      arr = [...riceCategory[1].list];
      arr.push(values);
      console.log("arr 2", arr);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select Category"
        placeholder="Eg. Non-Basmati"
        data={[
          { value: "non-basmati", label: "Non-Basmati" },
          { value: "basmati", label: "Basmati" },
        ]}
        {...form.getInputProps("category")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Variant name"
        placeholder="eg. 1509 Sella"
        {...form.getInputProps("name")}
      />

      <Space h="md" />
      {categoriesList.map((k, i) => {
        return (
          <Group spacing="md" key={i}>
            <Select
              required
              label="Select Region"
              placeholder="Eg. Karnal"
              data={[]}
              {...form.getInputProps(
                "region"
              )}
            />
           

            <NumberInput
              required
              label="Ex-Mill"
              placeholder="Eg. 26500"
              {...form.getInputProps("exmill")}
            />
            
            <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            // width: "100%",
            marginTop: `3%`,
            
          }}
        >
          <Group spacing="md" position="right" margin-bottom="10px">
              <ActionIcon variant="filled" onClick={() => handleDeleteItem(i)}>
                <Minus size={20}/>
              </ActionIcon>
              </Group>
        </div>
            {/* <Group spacing="md" position="right" margin-bottom="10px">
              <ActionIcon variant="filled" onClick={() => handleDeleteItem(i)}>
                <Minus size={20}/>
              </ActionIcon> */}
              {/* <ActionIcon
                variant="filled"
                disabled={false}
                onClick={() => handleUpdate(i)}
              >
                // {/* <Check size={20} /> */}
              {/* </ActionIcon> */} 
            {/* </Group> */}
          </Group>
        );
      })}

      <Space h="md" />

      <Group spacing="md" grow>
        <Select
          required
          label="Select Region"
          placeholder="Eg. Karnal"
          data={[]}
          {...form.getInputProps(
           "region"
          )}
        />
        

        <NumberInput
          required
          label="Ex-Mill"
          placeholder="Eg. 26500"
         
          {...form.getInputProps("exmill")}
        />
       

        <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            width: "100%",
            marginTop: `3%`,
            
          }}
        >
          <Button onClick={handleClick}>+</Button>
          {/* <ArrowRightCircle size={24} style={{ marginTop: `14%` }} />
          <Space w="md" /> */}
          {/* <Select
            required
            label="Destination Port"
            placeholder="Eg. SINGAPORE"
            style={{
              width: "100%",
            }}
            data={[]}
            {...form.getInputProps("destination")} 
           /> */}
        </div>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditProductForm;
