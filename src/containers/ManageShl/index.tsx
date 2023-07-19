import React, {useEffect,useState} from "react";
import { Plus, X , Check} from "tabler-icons-react";
import { Text} from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditShlForm from "../../forms/ManageShl/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";

import {
  getShlData,
  getDestinationData,
  getOriginData,
  postShlData,
  deleteShlData,
  patchShlData,
} from "../../services/export-costing/SHL";

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
    label: "SHL",
    key: "shlCharge",
  },
  {
    label: "THC",
    key: "thc",
  },
  {
    label: "B/LFee",
    key: "blFee",
  },
  {
    label: "Surrender",
    key: "surrender",
  },
  {
    label: "Convenience",
    key: "convenienceFee",
  },
  {
    label: "Seal",
    key: "seal",
  },
  {
    label: "COO",
    key: "coo",
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
    <EditShlForm
      handleCloseModal={handleCloseModal}
      regionSelectOptions={regionSelectOptions}
      destinationSelectOptions={destinationSelectOptions}
      handleSaveAction={handleSaveAction}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageShlContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [shlData, setShlData] = useState<any>([]);
  const [regionSelectOptions, setRegionSelectOptions] = useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get SHL Data from database
  const handleGetShl= async (list: any) => {
    const response: any = await getShlData(list);
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

        setShlData(() => [...array]);
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
      handleGetShl(originList);
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
      ...destination,
    }));
  
    if (payload[0] && modalType === "add") {
      const response = await postShlData(payload[0]);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "SHL Charges Added!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color:'green',
        });   
      }
    }

    if (payload && modalType === "update") {
      const response = await patchShlData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "SHL Charges Updated!",
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
      title: "Delete the SHL Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the SHL Data? 
          <Text fw={500}>Note:This action is destructive and you will have to contact support to restore
          this data.</Text> 
          </Text>
      ),
      labels: { confirm: "Delete SHL Data", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteVariant(rowData),
    });
  const handleDeleteVariant = async (data: any) => {
    const response = await deleteShlData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "SHL Charges Deleted!",
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
    if (shlData.length && destinationSelectOptions.length) {
      const tableData = shlData.flatMap((d:any) => {
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
  }, [shlData, destinationSelectOptions]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add SHL Charges" : "Update SHL Charges"
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
                shlCharge: obj.shlCharge,
                thc: obj.thc,
                blFee: obj.blFee,
                surrender: obj.surrender,
                convenienceFee: obj.convenienceFee,
                muc: obj.muc,
                seal: obj.seal,
                coo: obj.seal,
                _id:obj._id,
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

export default ManageShlContainer;
