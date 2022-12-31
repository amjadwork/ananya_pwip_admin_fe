export const eceForm = [
  {
    label: "Name",
    name: "name",
    type: "input",
    placeholder: "Fill the name",
  },
  {
    label: "Company Name",
    name: "companyName",
    type: "input",
    placeholder: "Fill the Comapny Name",
  },
  {
    label: "Contact Details",
    name: "contactDetails",
    type: "input",
    placeholder: "Fill the Company Details",
  },
  {
    label: "Date",
    name: "date",
    type: "date",
    placeholder: "Fill the date",
  },
  {
    label: "Choose One",
    name: "chooseOne",
    type: "radio",
    options: [{ name: "Exporter" }, { name: "Importer" }, { name: "Miller" }],
  },
  {
    label: "Today's Dollar Price (Rs 75.0)",
    name: "dollarPrice",
    type: "input",
    placeholder: "Enter the Dollar Price",
  },
  {
    label: "Type of Booking",
    name: "bookingType",
    type: "radio",
    options: [{ name: "FCL" }],
  },
  {
    label: "Terms Of Shipment",
    name: "shipmentTerms",
    placeholder: "Select Shipment Method",
    type: "radio",
    options: [
      { name: "FOB " },
      { name: "CIF" },
    ],
  },
  {
    label: "Type of Product",
    name: "productType",
    type: "select",
    placeholder: "rice",
    options: [
      { value: " Rice", label: "Rice" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    label: "Rice Category",
    name: "productCategotry",
    type: "select",
    placeholder: "Select Rice Category",
    options: [
      { value: "Basmati", label: "Basmati" },
      { value: "Non Basmati", label: "Non Basmati" },
    ],
  },
  {
    label: "Rice Variety",
    name: "variety",
    type: "select",
    placeholder: "Select Rice Variety",
    options: [
      { value: "SonaMasori ", label: "SonaMasori" },
      { value: "IR64", label: "IR64" },
    ],
  },
 
  {
    label: "Sourcing Location",
    name: "sourcingLocation",
    type: "select",
    placeholder: "Select Sourcing Location",
    options: [
      { value: "Haryana", label: "Haryana " },
      { value: "Punjab", label: "Punjab" },
      { value: "Karnataka", label: "Raipur" },
      { value: "Vellore", label: "Vellore" },
    ],
  },
  {
    label: "Origin Port / City",
    name: "originPort",
    type: "select",
    placeholder: "Seach here",
    options: [
      { value: "Chennai", label: "Chennai" },
      { value: "Gujarat", label: "Gujarat" },
      { value: "Mumbai", label: "Mumbai" },
      { value: "West bengal", label: "West bengal" },
    ],
  },
  {
    label: "Destination Port / City",
    name: "destinationPort",
    type: "select",
    placeholder: "Seach here",
    options: [
      { value: "Singapore", label: "Singapore" },
      { value: "Vietnam", label: "Vietnam" },
      { value: "Qwait", label: "Qwait" },
      { value: "Dubai", label: "Dubai" },
    ],
  },
  {
    label: "Broken Percentage(%)",
    name: "brokenPercentage",
    type: "counter",
    placeholder: "@5",
  },

  {
    label: "Enter your own ex-mill price",
    name: "exMill",
    type: "input",
    placeholder: "write down ex-mill price",
  },
  
  {
    label: "Type of Container",
    name: "containerType",
    type: "select",
    placeholder: "Select type of container",
    options: [{ value: "20ft", label: "General Container(20ft)" }],
  },
  {
    label: "Container Count",
    name: "containerCount",
    type: "counter",
    placeholder: "@1",
  },
  {
    label: "Container Weight ",
    name: "containerWeight",
    type: "radio",
    options: [{ name: "Metric tons" }, { name: "Kg" }, { name: "Quintel" }],
  },
  {
    label: "Type of Bags ",
    name: "bagTypes",
    type: "select",
    placeholder: "Eg. BOPP",
    options: [
      { value: "BOPP ", label: "BOPP" },
      { value: "PP Woven", label: "PP Woven" },
      { value: "Jute Bags ", label: "Jute Bags" },
      { value: "PE Bags", label: "PE Bags" },
    ],
  },
  {
    label: "Bag Weight",
    name: "bagWeight",
    type: "select",
    placeholder: "Bag weight in kg ",
    options: [
      { value: "18kg ", label: "18kg" },
      { value: "25kg", label: "25kg" },
      { value: "50kg", label: "50kg" },
    ],
  },
  {
    label: "Bags Charges",
    name: "BagsCharges",
    type: "input",
    placeholder: "Fill the Bags charges:",
  },
  {
    label: "Transportation Charges(Rs/mt ton)",
    name: "TransportationCharges",
    type: "input",
    placeholder: "Fill the Transport charges:",
  },

  {
    label: "CFS Handling Charges(Rs/mt ton)",
    name: "CfshandlingCharges",
    type: "input",
    placeholder: "Fill the handling charges:",
  },
  // {label:"Craft Paper" ,name:"CraftPaper" , type:"input"},
  // {label:"Silica Gel" ,name:"SilicaGel" , type:"input"},
  // {label:"Loading Charges" ,name:"LoadingCharges" , type:"input"},
  // {label:"Transportation Charges" ,name:"TransportationCharges" , type:"input"},
  // {label:"Custom Charges" ,name:"CustomCharges" , type:"input"},
  // {label:"PQ Certificate" ,name:"PQCertificate" , type:"input"},
  // {label:"COO" ,name:"COO" , type:"input"},
  {
    label: "Finance Cost (Rs/mt ton)",
    name: "FinanceCost",
    type: "input",
    placeholder: "Fill the finance costing:",
  },
  {
    label: "Inspection Cost (Rs/mt ton)",
    name: "InspectionCost",
    type: "input",
    placeholder: "Fill the Inspection cost:",
  },
  {
    label: "Overheads (Rs/mt ton)",
    name: "Overheads",
    type: "input",
    placeholder: "Overheads:",
  },
  {
    label: "Shipping Line Local Charges (Rs/mt ton)",
    name: "ShippingCost",
    type: "input",
    placeholder: "Fill the Shipping Line Charges:",
    
  },
      
      {label:"Original B/L Fee" ,name:"OriginalBLFee" , type:"input",
      placeholder: "Original B/L Fee",
    },
     
  {
    label: "OFC(Ocean Freight Charges) (Rs/mt ton)",
    name: "Ofc",
    type: "input",
    id: 'hideInput',
    placeholder: "Fill the OFC Charges:",
  },
  {
    label: "Insurance Cost (Rs/mt ton)",
    name: "InsuranceCost",
    type: "input",
    placeholder: "Fill the Insurance cost:",
  },
  {
    label: "Margin (Rs/mt ton)",
    name: "MarginCost",
    type: "input",
    placeholder: "Fill the margin cost:",
  },
 


];

// export const AllCfsCost = [
//   {label:"Craft Paper" ,name:"CraftPaper" , type:"input"},
//   {label:"Silica Gel" ,name:"SilicaGel" , type:"input"},
//   {label:"Loading Charges" ,name:"LoadingCharges" , type:"input"},
//   {label:"Transportation Charges" ,name:"LTransportationCharges" , type:"input"},
//   {label:"Custom Charges" ,name:"CustomCharges" , type:"input"},
//   {label:"PQ Certificate" ,name:"PQCertificate" , type:"input"},
//   {label:"COO" ,name:"COO" , type:"input"},
// ];

// export const ALLShippingCost = [
//   {label:"THC" ,name:"Thc" , type:"input"},
//   {label:"Original B/L Fee" ,name:"OriginalBLFee" , type:"input"},
//   {label:"Surrender" ,name:"Surrender" , type:"input"},
//   {label:"MUC" ,name:"Muc" , type:"input"},
//   {label:"Seal" ,name:"Seal" , type:"input"},
//   {label:"Convenience fee" ,name:"ConvenienceFee" , type:"input"},
//   {label:"Others" ,name:"Others" , type:"input"},
// ];
