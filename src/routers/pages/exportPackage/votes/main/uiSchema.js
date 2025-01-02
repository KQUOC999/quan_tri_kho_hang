const uiSchema = {
  numberVote: {
    "ui:widget": "text",
    "ui:placeholder": "Số phiếu",
    "ui:options": {
      label: false, 
    },
  },

  descriseVote: {
    "ui:widget": "text",
    "ui:placeholder": "Diễn giải",
    "ui:options": {
      label: false, 
    },
  },

  dateVote: {
    "ui:widget": "date",
    "ui:placeholder": "20/10/2024",
    "ui:options": {
      label: false, 
    },
  },

  totalWareHouse: {
    "ui:widget": "select",
    "ui:placeholder": "Tất cả kho",
    "ui:options": {
      label: false, 
    },
  },
  
  'ui:submitButtonOptions': {
    submitText: "Tìm kiếm",
    norender: false,
    props: {
      disabled: false,
    }
  }
};

export default uiSchema;
