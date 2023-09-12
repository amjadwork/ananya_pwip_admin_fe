export type MessageTemplates = {
    [key: string]: {
      successMessage: string;
      errorMessage: string;
    };
  };
  
  export const messages: MessageTemplates = {
    variant: {
      successMessage: "Variants added successfully!",
      errorMessage: "Something went wrong while adding variants.",
    },
    transportation: {
      successMessage: "Transportation Charges Updated Successfully!",
      errorMessage: "Something went wrong while updating transportation Charges.",
    },
    cha: {
      successMessage: "CHA Charges Updated Successfully!",
      errorMessage: "Something went wrong while updating CHA Charges.",
    },
    shl: {
      successMessage: "SHL Charges Updated Successfully!",
      errorMessage: "Something went wrong while updating SHL Charges.",
    },
    ofc: {
      successMessage: "OFC Charges Updated Successfully!",
      errorMessage: "Something went wrong while updating OFC data.",
    },
  };