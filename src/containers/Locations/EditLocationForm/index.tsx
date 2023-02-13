import React, { useState, useEffect } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
} from "@mantine/core";
import { ArrowRightCircle, Category } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { locationCat } from "../../../constants/var.constants";
// import { useNavigate } from "react-router-dom";
// import EditLocationForm from "./locForm";

function EditLocationFormContainer(props: any) {
  const [fieldValue, setFieldValue] = useState("");
  const [state, setState] = useState(false);
  // const [origin, setorigin] = useState(false);
  const [select, setSelect] = useState(false);
  const [selectValue,setSelectValue] =useState("");

  const handleCloseModal = props.handleCloseModal;


  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: "",
      category: "",
      // regionName:"",
      // cityName:"",
      // portName:"",
      // // source: "",
      // // origin: "",
      // destination: "",
      // state: "",
    },

    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    // },
  });

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    setFieldValue(values.category);
    
    setState(true);
    setSelect(true);
    // setorigin(false);
    handleCloseModal(false);

    // console.log("arr 5", values);

    let arr: any = [];
    if (values.name === "Source Location") {
      arr = [...locationCat[0].list];
      arr.push(values);
      console.log("arr 1", arr);
    }
    if (values.name === "Origin Ports") {
      arr = [...locationCat[1].list];
      arr.push(values);
      console.log("arr 1", arr);
    } else {
      arr = [...locationCat[2].list];
      arr.push(values);
      console.log("arr 3", arr);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select location type"
        placeholder="Eg. Source"
        disabled={select}
        data={[
          { value: "source", label: "Source" },
          { value: "origin", label: "Origin" },
          { value: "destination", label: "Destination" },
        ]}
        onChange={(Cat:any)=>{
          console.log("Cat",Cat);
          setSelectValue(Cat);

        }}

        // {...form.getInputProps("category")}
      />
      <Space h="md" />
      {/* <Group position="right" mt="md" spacing="md"> 
        <Button 
        // onClick={(val:any) => {
        //   console.log(val,"event");
        //   // event.preventDefault()
        // }}
        // type="submit" 
        // disabled={state}
        >Next</Button>
      </Group> */}

     { 
       (selectValue ==="source")? 
       <>
       <TextInput
        required
         label="Region Name"
        placeholder="eg. Kolkata"
        {...form.getInputProps("name")}
        />
      <Space h="md" />
       <Select
         required
        label="State Name"
        data={[
          { value: "Andhra Pradesh", label: "Andhra Pradesh" },
          { value: "Andaman & Nicobar Islands", label: "Andaman & Nicobar Islands" },
          { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
          { value: "Assam", label: "Assam" },
          { value: "Bihar", label: "Bihar" },
          { value: "Chhattisgarh", label: "Chhattisgarh" },
          { value: "Haryana", label: "Haryana" },
          { value: "Punjab", label: "Punjab" },
          { value: "Rajasthan", label: "Rajasthan " },
          { value: "Gujarat", label: "Gujarat " },
          { value: "Madhya Pradesh", label: "Madhya Pradesh" },
          { value: "Utter Pradesh", label: "Utter Pradesh" },
          { value: "Jharkhand", label: "Jharkhand" },
          { value: "West Bengal", label: "West Bengal" },
          { value: "Karnataka", label: "Karnataka" },
          { value: "Kerala", label: "Kerala " },
          { value: "Tamil Nadu", label: "Tamil Nadu" },
          { value: "Himachal Pradesh", label: "Himachal Pradesh" },
          { value: "Jammu & Kashmir", label: "Jammu & Kashmir" },
          { value: "Maharashtra", label: "Maharashtra" },
          { value: "Odisha", label: "Odisha" },
          { value: "Uttarakhand", label: "Uttarakhand" },
          { value: "Telangana", label: "Telangana" },
          { value: "Tripura", label: "Tripura" },
          { value: "Sikkim", label: "Sikkim" },
          { value: "Nagaland", label: "Nagaland" },
          { value: "Mizoram", label: "Mizoram" },
          { value: "Meghalaya", label: "Meghalaya" },
          { value: "Lakshadweep", label: "Lakshadweep" },
          { value: "Goa", label: "Goa" },
        ]}
         placeholder="eg. Haryana"
        {...form.getInputProps("state")}
       />
       <Space h="md" />
      <Group position="right" mt="md" spacing="md"> 
        <Button type="submit" >Submit</Button>
      </Group>
      </>: null}

      {(selectValue==="origin") ?(
      <>
      <TextInput
        required
        
        label="Enter Port Name"
        placeholder="eg. JNPT"
        {...form.getInputProps("Port")}
      />
      <Space h="md" />
      <TextInput
        required
        
        label="Enter CFS Station"
        placeholder="eg. Chennai cfs"
        {...form.getInputProps("cfs")}
      />
      <Space h="md" />
      <TextInput
        required
        
        label="Enter City Name"
        placeholder="eg. Kolkata"
        {...form.getInputProps("City")}
      />
      <Space h="md" />
      <Select
        required
        data={[
          { value: "Andhra Pradesh", label: "Andhra Pradesh" },
          { value: "Andaman & Nicobar Islands", label: "Andaman & Nicobar Islands" },
          { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
          { value: "Assam", label: "Assam" },
          { value: "Bihar", label: "Bihar" },
          { value: "Chhattisgarh", label: "Chhattisgarh" },
          { value: "Haryana", label: "Haryana" },
          { value: "Punjab", label: "Punjab" },
          { value: "Rajasthan", label: "Rajasthan " },
          { value: "Gujarat", label: "Gujarat " },
          { value: "Madhya Pradesh", label: "Madhya Pradesh" },
          { value: "Utter Pradesh", label: "Utter Pradesh" },
          { value: "Jharkhand", label: "Jharkhand" },
          { value: "West Bengal", label: "West Bengal" },
          { value: "Karnataka", label: "Karnataka" },
          { value: "Kerala", label: "Kerala " },
          { value: "Tamil Nadu", label: "Tamil Nadu" },
          { value: "Himachal Pradesh", label: "Himachal Pradesh" },
          { value: "Jammu & Kashmir", label: "Jammu & Kashmir" },
          { value: "Maharashtra", label: "Maharashtra" },
          { value: "Odisha", label: "Odisha" },
          { value: "Uttarakhand", label: "Uttarakhand" },
          { value: "Telangana", label: "Telangana" },
          { value: "Tripura", label: "Tripura" },
          { value: "Sikkim", label: "Sikkim" },
          { value: "Nagaland", label: "Nagaland" },
          { value: "Mizoram", label: "Mizoram" },
          { value: "Meghalaya", label: "Meghalaya" },
          { value: "Lakshadweep", label: "Lakshadweep" },
          { value: "Goa", label: "Goa" },
        ]}
        label="Enter State Name"
        placeholder="eg. Maharashtra"
        {...form.getInputProps("State")}
      />
      <Space h="md" />
      <Group position="right" mt="md" spacing="md"> 
        <Button type="submit">Submit</Button>
      </Group>
      </>): null}

      <Space h="md" />
      {(selectValue ==="destination")?(
      <>
      <TextInput
        required
        
        label="Enter Port Name"
        placeholder="eg. JNPT"
        {...form.getInputProps("Port")}
      />
      <TextInput
        required
        
        label="Enter Country Name"
        placeholder="eg. Vietnam"
        {...form.getInputProps("country")}
      />
      <Space h="md" />
      <Group position="right" mt="md" spacing="md"> 
        <Button type="submit" >Submit</Button>
      </Group>
      </>):null}

    </form>
  );
}

export default EditLocationFormContainer;
