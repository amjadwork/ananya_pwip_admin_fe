import React, {useEffect,useState} from "react";
import { Plus, X , Check} from "tabler-icons-react";
import { Text} from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditOfcForm from "../../forms/ManageOfc/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";

import {
  getOfcData,
  getDestinationData,
  getOriginData,
  postOfcData,
  deleteOfcData,
  patchOfcData,
} from "../../services/export-costing/OFC";

const columns = [
  {
    label: "Destination",
    key: "destination",
  },
  {
    label: "Origin",
    key: "origin",
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
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const modalType = props.modalType;

  return (
    <EditOfcForm
      handleCloseModal={handleCloseModal}
      regionSelectOptions={regionSelectOptions}
      destinationSelectOptions={destinationSelectOptions}
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
  const [regionSelectOptions, setRegionSelectOptions] = useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get OFC Data from database
  const handleGetOfc= async (list: any) => {
    const response: any = await getOfcData(list);
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
      setRegionSelectOptions(() => [...originOptions]);
      handleGetDestination();
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

 //to add new or edit the existing row in the table
  const handleSaveAction = async (data:any) => {
    const payload = data.destinations.flatMap((destination:any) => ({
      _originPortId: data._originPortId,
      _ofcObjectId:data._ofcObjectId,
      ...destination,
    }));
  
    if (payload[0] && modalType === "add") {
      const response = await postOfcData(payload[0]);

      if (response) {
        handleGetOrigin();
        showNotification({
          title: "OFC Charges Added!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color:'green',
        });   
      }
    }

    if (payload && modalType === "update") {
      const response = await patchOfcData(payload);

      if (response) {
        handleGetOrigin();
        showNotification({
          title: "OFC Charges Updated!",
          message: "",
          autoClose: 2000,
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
      onConfirm: () => handleDeleteVariant(rowData),
    });
  const handleDeleteVariant = async (data: any) => {
    const response = await deleteOfcData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "OFC Charges Deleted!",
        message: "",
        autoClose: 2000,
        icon: <X />,
        color:'red',
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
              regionSelectOptions={regionSelectOptions}
              handleSaveAction={handleSaveAction}
              destinationSelectOptions={destinationSelectOptions}
              updateFormData={updateFormData}
              modalType={modalType}
              modalOpen={modalOpen}
            />
          );
      }}
      modalSize="70%"
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
