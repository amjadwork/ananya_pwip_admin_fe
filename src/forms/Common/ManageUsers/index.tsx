import React, { useEffect, useState } from "react";
import {
  Grid,
  NumberInput,
  Space,
  TextInput,
  Select,
  Group,
  Textarea,
  ScrollArea,
  Tabs,
} from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";
import {
  instagram,
  facebook,
  linkedin,
  whatsapp,
  youtube,
  website,
} from "../../../constants/icons.constants";
import {
  getChangedPropertiesFromObject,
  intersectObjects,
} from "../../../helper/helper";

const requiredProfilePayload = {
  profile_pic: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  gstin: "",
  headline: "",
  bio: "",
  companyName: "",
  profession: "",
  website: "",
  youtube_url: "",
  facebook_url: "",
  instagram_url: "",
  whatsapp_link: "",
  linkedin_url: "",
};

const requiredUserPayload = {
  role_id: "",
  first_name: "",
  last_name: "",
  middle_name: "",
  full_name: "",
  email: "",
  phone: "",
};

const initialFormValues = {
  role_id: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  full_name: "",
  headline: "",
  email: "",
  phone: "",
  companyName: "",
  profession: "",
  gstin: "",
  bio: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  website: "",
  youtube_url: "",
  linkedin_url: "",
  facebook_url: "",
  whatsapp_link: "",
  instagram_url: "",
};

function EditUsersForm(props: any) {
  const rolesData = props.rolesData;
  const profileData = props.profileData;
  const handleCloseModal = props.handleCloseModal;
  const handleUserPatch = props.handleUserPatch;
  const handleProfilePatch = props.handleProfilePatch;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";

  const [profileObject, setProfileObject] = useState<any>([]);
  const [userObject, setUserObject] = useState<any>([]);
  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
    validate: {
      phone: (value) => {
        const string = value.toString();
        return string.length === 10 ? null : "Phone number must be 10 digits";
      },
      gstin: (value) => {
        return value.length !== 0 && value.length === 15
          ? null
          : value.length === 0
          ? null
          : "GST Number must be 15 characters";
      },
      zip_code: (value) => {
        const string = value.toString();
        return string.length > 1 && string.length === 6
          ? null
          : string.length === 0 || string.length === 1
          ? null
          : "zip code must be 6 digits";
      },
    },
  });

  const roleOptions = rolesData.map((list: any) => ({
    value: list._id,
    label: list.role.charAt(0).toUpperCase() + list.role.slice(1).toLowerCase(),
  }));
  const professionOptions = [
    { value: "exporter", label: "Exporter" },
    { value: "importer", label: "Importer" },
    { value: "miller", label: "Miller" },
    { value: "broker", label: "Broker/Agent" },
    { value: "trader", label: "Trader" },
    { value: "other", label: "Other" },
  ];
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      setUserObject(updateFormData);
      if (updateFormData._id) {
        const matchingProfile = profileData.find(
          (profile: any) => profile.user_id === updateFormData._id
        );
        setProfileObject(matchingProfile);
        if (matchingProfile) {
          const updatedFormData = {
            ...updateFormData,
            city: matchingProfile.city,
            state: matchingProfile.state,
            country: matchingProfile.country,
            zip_code: matchingProfile.zip_code,
            gstin: matchingProfile.gstin,
            headline: matchingProfile.headline,
            profession: matchingProfile.profession,
            companyName: matchingProfile.companyName,
            bio: matchingProfile.bio,
            website: matchingProfile.website,
            youtube_url: matchingProfile.youtube_url,
            facebook_url: matchingProfile.facebook_url,
            instagram_url: matchingProfile.instagram_url,
            whatsapp_link: matchingProfile.whatsapp_link,
            linkedin_url: matchingProfile.linkedin_url,
          };

          if (updatedFormData.full_name) {
            const [first_name, ...rest] = updatedFormData.full_name.split(" ");
            const last_name = rest.pop() || "";
            const middle_name = rest.join(" ");
            updatedFormData.first_name = first_name;
            updatedFormData.middle_name = middle_name;
            updatedFormData.last_name = last_name;
          }
          form.setValues(updatedFormData);
        }
      }
    }
  }, [updateFormData, modalType, profileData]);

  const handleFormSubmit = (formValues: typeof form.values) => {
    const full_name = `${formValues.first_name} ${formValues.middle_name} ${formValues.last_name}`;
    const values = {
      ...formValues,
      full_name,
    };
    const userFormValues = intersectObjects(requiredUserPayload, values);
    const profileFormValues = intersectObjects(requiredProfilePayload, values);

    const userPayload = getChangedPropertiesFromObject(
      userObject,
      userFormValues
    );
    const profilePayload = getChangedPropertiesFromObject(
      profileObject,
      profileFormValues
    );
    if (Object.keys(userPayload).length > 0) {
      const payload = {
        ...userPayload,
        _id: formValues._id,
      };
      handleUserPatch(payload);
    }
    if (Object.keys(profilePayload).length > 0) {
      const payload = {
        ...profilePayload,
        _id: formValues._id,
      };
      handleProfilePatch(payload);
    }
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Tabs color="blue" defaultValue="personal">
        <Tabs.List grow>
          <Tabs.Tab value="personal">Personal Details</Tabs.Tab>
          <Tabs.Tab value="company">Company Details</Tabs.Tab>
          <Tabs.Tab value="social">Social Details</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal" pt="30px">
          <ScrollArea h={450} offsetScrollbars>
            <Grid gutter="sm">
              <Grid.Col span={4}>
                <TextInput
                  required
                  label="First Name"
                  placeholder=""
                  {...form.getInputProps("first_name")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Middle Name"
                  placeholder=""
                  {...form.getInputProps("middle_name")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Last Name"
                  placeholder=""
                  {...form.getInputProps("last_name")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Email"
                  disabled={modalType === "update"}
                  placeholder="example@gmail.com"
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  required
                  label="Mobile"
                  type="number"
                  placeholder=""
                  hideControls
                  inputMode="numeric"
                  {...form.getInputProps("phone")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  required
                  hideControls
                  label="Role"
                  data={roleOptions}
                  placeholder="eg. admin"
                  {...form.getInputProps("role_id")}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TextInput
                  label="Headline"
                  placeholder=""
                  {...form.getInputProps("headline")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  placeholder="Write here"
                  label="Bio"
                  {...form.getInputProps("bio")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="City"
                  placeholder=""
                  {...form.getInputProps("city")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  hideControls
                  type="number"
                  label="Zip Code"
                  placeholder="xxxxxx"
                  inputMode="numeric"
                  {...form.getInputProps("zip_code")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="State"
                  placeholder=""
                  {...form.getInputProps("state")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Country"
                  placeholder=""
                  {...form.getInputProps("country")}
                />
              </Grid.Col>
            </Grid>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="company" pt="xs">
          <ScrollArea h={450} offsetScrollbars>
            <Grid gutter="sm">
              <Grid.Col span={12}>
                <Select
                  hideControls
                  label="Profession"
                  data={professionOptions}
                  placeholder="eg. miller"
                  {...form.getInputProps("profession")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Company Name"
                  placeholder=""
                  {...form.getInputProps("companyName")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Company Addresss"
                  placeholder=""
                  {...form.getInputProps("companyAddress")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="GST Number"
                  placeholder=""
                  hideControls
                  {...form.getInputProps("gstin")}
                />
              </Grid.Col>
            </Grid>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="social" pt="xs">
          <ScrollArea h={450} offsetScrollbars>
            <Grid gutter="sm">
              <Grid.Col span={12}>
                <TextInput
                  hideControls
                  label="WhatsApp"
                  icon={whatsapp}
                  placeholder=""
                  {...form.getInputProps("whatsapp_link")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="LinkedIN"
                  placeholder=""
                  icon={linkedin}
                  {...form.getInputProps("linkedin_url")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Facebook"
                  placeholder=""
                  icon={facebook}
                  {...form.getInputProps("facebook_url")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Website"
                  placeholder=""
                  icon={website}
                  {...form.getInputProps("website")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Youtube"
                  placeholder=""
                  icon={youtube}
                  {...form.getInputProps("youtube_url")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Instagram"
                  placeholder=""
                  icon={instagram}
                  {...form.getInputProps("instagram_url")}
                />
              </Grid.Col>
            </Grid>
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
      <Space h="sm" />
      <Group position="right" mt="md" spacing="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditUsersForm;
