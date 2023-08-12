import React, {useEffect,useState} from "react";
import { Plus, Check} from "tabler-icons-react";
import { Text} from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditOfcForm from "../../forms/ManageOfc/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import { getContainerData } from "../../services/export-costing/Container";
import { 
  getDestinationDataByOrigin, 
  getDestinationData,
  getOriginData,
} from "../../services/export-costing/Locations";
import {
  getOfcData,
  postOfcData,
  deleteOfcData,
  patchOfcData,
} from "../../services/export-costing/OFC";

const columns = [
  {
    label: "Origin",
    key: "origin",
  },
  {
    label: "Destination",
    key: "destination",
  },
  {
    label: "OFC",
    key: "ofcCharge",
  },
  {
    label: "Action",
    key: "action",
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const originSelectOptions = props.originSelectOptions;
  const containerSelectOptions=props.containerSelectOptions;
  const handleGetDestinationDataByOrigin = props.handleGetDestinationDataByOrigin;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const modalType = props.modalType;

  return (
    <EditOfcForm
      handleCloseModal={handleCloseModal}
      originSelectOptions={originSelectOptions}
      containerSelectOptions={containerSelectOptions}
      handleGetDestinationDataByOrigin={handleGetDestinationDataByOrigin} 
      handleSaveAction={handleSaveAction}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageOfcContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [ofcData, setOfcData] = useState<any>([]);
  const [originSelectOptions, setOriginSelectOptions] = useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] = useState<any>([]);
  const [containerSelectOptions, setContainerSelectOptions] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get OFC Data from database
  const handleGetOfc= async (list: any) => {
    const response: any = await getOfcData();
    try {
      if (response) {
        let array: any = list?.map((item: any) => {
          let destinationArr: any = [];
          let originIdStringArr: any = [];

          response.forEach((origin: any) => {
            if (item._originId === origin._originPortId) {
              destinationArr.push(origin.destinations);
              originIdStringArr.push(origin._originId);
            }
          });

         
          return {
            ...item,
            list: originIdStringArr.includes(item._originPortId)
              ? destinationArr.flat(1)
              : [],
          };
        });

      setOfcData(() => [...array]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //to get Origin Data from database
  const handleGetOrigin= async () => {
    const response = await getOriginData();
    if (response) {
      const originList = response.origin.map((d: any) => {
        return {
          name: d.portName,
          _originId: d._id,
          list: [],
        };
      });

      const originOptions = response.origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });
      setOriginSelectOptions(() => [...originOptions]);
      handleGetDestination();
      handleGetContainer();
      handleGetOfc(originList);
    }
  };

  //to get Destination Data from database
  const handleGetDestination = async () => {
    const response = await getDestinationData();

    if (response) {
      const destinationOptions = response.destination.map(
        (d: any) => {
          return {
            label: d.portName,
            value: d._id,
          };
        }
      );
      setDestinationSelectOptions(() => [...destinationOptions]);
    }
  };

  const handleGetDestinationDataByOrigin = async (originPortId:any) => {
    try {
      const response = await getDestinationDataByOrigin(originPortId);
      return response.destination.map((d: any) => ({
        label: d.portName,
        value: d._id,
      }));
    } catch (error) {
      console.error("Error fetching destination data:", error);
      return [];
    }
  };

   //to get Container Data from database
   const handleGetContainer = async () => {
    const response = await getContainerData();

    if (response) {
      const containerOptions = response.map(
        (d: any) => {
          return {
            label:`${d.type} - ${d.size} - ${d.weight}${d.unit}`,
            value: d._id,
          };
        }
      );
      setContainerSelectOptions(() => [...containerOptions]);
    }
  };

 //to add new or edit the existing row in the table
  const handleSaveAction = async (data:any) => {

    if (data && modalType === "add") {
      const response = await postOfcData(data);

      if (response) {
        handleGetOrigin();
        showNotification({
          title: "OFC Charges Added!",
          message: "",
          autoClose: 4000,
          icon: <Check />,
          color:'green',
        });   
      }
    }

     const payload = data.destinations.flatMap((destination:any) => ({
      _originPortId: data._originPortId,
      ...destination,
    }));
    console.log("payload", payload)
  

    if (payload[0] && modalType === "update") {
      const response = await patchOfcData(payload[0]);

      if (response) {
        handleGetOrigin();
        showNotification({
          title: "OFC Charges Updated!",
          message: "",
          autoClose: 4000,
          icon: <Check />,
          color:'green',
        });
      }
    }
  };

  //to delete a single row data
  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the OFC Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the OFC Data? 
          <Text fw={500}>Note:This action is destructive and you will have to contact support to restore
          this data.</Text> 
          </Text>
      ),
      labels: { confirm: "Delete OFC Data", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });
  const handleDeleteRow = async (data: any) => {
    const response = await deleteOfcData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "OFC Charges Deleted!",
        message: "",
        autoClose: 4000,
        icon: <Check />,
        color:'green',
      });
    }  
  };

  const handleRefreshCalls = () => {
    handleGetOrigin();
  };

  useEffect(() => {
    handleGetOrigin();
  }, []);

  useEffect(() => {
    if (ofcData.length && destinationSelectOptions.length) {
      const tableData = ofcData.flatMap((d:any) => {
        return d.list.map((l:any) => {
          const destination = destinationSelectOptions.find(
            (option:any) => option.value === l._destinationPortId
          );
  
          return {
            ...l,
            origin: d.name,
            destination: destination ? destination.label : "Null",
            _originPortId: d._originId,
          };
        });
      });
      setTableRowData(tableData);
    }
  }, [ofcData, destinationSelectOptions]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add OFC Charges" : "Update OFC Charges"
      }
      onModalClose={() => {
        setModalOpen(false)
        setUpdateFormData(null);
      }}

      ModalContent={() => {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setModalOpen(bool)}
              originSelectOptions={originSelectOptions}
              handleSaveAction={handleSaveAction}
              handleGetDestinationDataByOrigin={handleGetDestinationDataByOrigin}
              containerSelectOptions={containerSelectOptions}
              updateFormData={updateFormData}
              modalType={modalType}
              modalOpen={modalOpen}
            />
          );
      }}
      modalSize="60%"
    >
      <DataTable
        data={tableRowData}
        columns={columns}
        actionItems={[
          {
            label: "Add",
            icon: Plus,
            color: "gray",
            type: "button",
            onClickAction: () => {
              setModalOpen(true);
              setModalType("add");
            },
          },
        ]}
        handleRowEdit={(row: any, index: number) => {
          setModalType('update')
          let obj = { ...row };
          const formObj = {
            _originPortId: obj._originPortId,
            destinations: [
              {
                _destinationPortId: obj._destinationPortId,
                _containerId:obj._containerId,
                ofcCharge: obj.ofcCharge,
                _ofcObjectId: obj._id,
              },
            ],
          }
          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        handleRowDelete={(row: any) => {
          openDeleteModal(row);
        }}
      />
    </PageWrapper>
  );
}

export default ManageOfcContainer;
