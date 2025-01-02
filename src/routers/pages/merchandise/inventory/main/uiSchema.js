const uiSchema = {
  searchProducts: {
    "ui:widget": "text",
    "ui:placeholder": "Tìm kiếm theo tên, mã sản phẩm, barcode",
    "ui:options": {
      label: false, 
    },
  },
 
  'ui:submitButtonOptions': {
    submitText: "Lọc",
    norender: true,
    props: {
      disabled: true,
    }
  }
};

export default uiSchema;
