const uiSchema = {
  stores: {
    "ui:widget": "select",
    "ui:placeholder": "-Cửa hàng-",
    "ui:options": {
      label: false, 
    },
  },
  id: {
    "ui:widget": "text",
    "ui:placeholder": "ID",
    "ui:options": {
      label: false, 
    },
  },
 
  employeeInfo: {
    "ui:widget": "text",
    "ui:placeholder": "Thông tin nhân viên",
    "ui:options": {
      label: false, 
    },
  },

  access: {
    "ui:widget": "select",
    "ui:placeholder": "-Quyền-",
    "ui:options": {
      label: false, 
    },
  },
  'ui:submitButtonOptions': {
    submitText: "Lọc",
    norender: false,
    props: {
      disabled: false,
    }
  }
};

export default uiSchema;
