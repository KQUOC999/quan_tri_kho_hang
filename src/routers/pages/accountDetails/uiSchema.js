const uiSchemaAccountDetails = {
  userProvinceCity: {
    "ui:placeholder": "Chọn tỉnh/thành phố",
    "ui:widget": "select",
  },
  userDistrict: {
    "ui:placeholder": "Chọn quận/huyện",
    "ui:widget": "select",
  },
  userWardsACommunes: {
    "ui:placeholder": "Chọn phường/xã",
    "ui:widget": "select",
  },
  'ui:submitButtonOptions': {
    submitText: "Lưu",
    norender: false,
    props: {
      disabled: false,
    }
  }
};

export default uiSchemaAccountDetails;
