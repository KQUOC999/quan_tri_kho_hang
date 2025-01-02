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
  productsNameCode: {
    "ui:widget": "text",
    "ui:placeholder": "Tên, mã sản phẩm",
    "ui:options": {
      label: false, 
    },
  },
  category: {
    "ui:widget": "text",
    "ui:placeholder": "Danh mục",
    "ui:options": {
      label: false, 
    },
  },

  productsStatus: {
    "ui:widget": "select",
    "ui:placeholder": "Tình trạng sản phẩm",
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
