import React, { useEffect, useState, useCallback } from 'react';
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import styles from './styles.module.css';
import { useAppContext } from '../appContext/AppContext';
import uiSchemaAccountDetails from './uiSchema';
import LoadingPage from '../loadingPage/loadingPage';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });


const AccountDetails = ({ initialFormData }) => {
  const [isFormReady, setIsFormReady] = useState(false);
  const [jsonSchemaAccountDetails, setJonSchemaAccountDetails] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(true);
  const [dataDataAdress, setDataAdress] = useState([]);
  const [listCityEnums, setListCityEnums] = useState([]);
  const [selectedCity, setSelectedCity] = useState(initialFormData?.userProvinceCity || '');

  const [listDistrictEnums, setListDistrictEnums] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [listCommunesWardsEnums, setListCommunesWardsEnums] = useState([]);
  const { setData } = useAppContext();
  const [formData, setFormData] = useState(initialFormData || {});

  const handleCloseAccountClick = () => {
    const updatedShowAccountDetails = !showAccountDetails;
    setShowAccountDetails(updatedShowAccountDetails);   
    setData(updatedShowAccountDetails);
    setTimeout(() => {
        setData({});
    }, 1000);
  };

  function fetchData() {
    async function fetchDataAccountDetails() {
      try {
        const functionName = 'call_accountDetails';
        const response = await app?.currentUser?.callFunction(functionName);
        const schemaData = response?.public?.input?.jsonSchemaAccountDetail;
        if (schemaData) {
          setJonSchemaAccountDetails(schemaData);
          setFormData(schemaData);
        } else {
          console.log("No schema data available");
        }
      } catch (error) {
        console.log("Error fetching account details:", error.message);
      }
    }
  
    async function fetchDataAdministrativeUnit() {
      try {
        const savedData = localStorage.getItem('administrativeData');
        if (savedData) {
          setDataAdress(JSON.parse(savedData));
        } else {
          const functionName = 'call_administrativeUnit';
          const response = await app?.currentUser?.callFunction(functionName);
          if (response) {
            setDataAdress(response);
            localStorage.setItem('administrativeData', JSON.stringify(response));
          }
        }
      } catch (error) {
        console.log('Error fetching administrative data:', error.message);
      }
    }
  
    async function fetchAllData() {
      await fetchDataAdministrativeUnit();
      await fetchDataAccountDetails();
    }
    fetchAllData();
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  const listCity = useCallback(() => {
    if (!dataDataAdress || dataDataAdress.length === 0) {
      return;
    }
    const uniqueCities = dataDataAdress
      .filter(item => item && item["Mã TP"])
      .filter((item, index, self) => index === self.findIndex(t => t["Mã TP"] === item["Mã TP"]))
      .map(item => item["Tình/ Thành Phố"])
      .filter(name => name !== undefined && name !== null);
    const cleanedCities = uniqueCities.map(name => name.replace(/Tỉnh|Thành phố/g, '').trim());
    setListCityEnums(cleanedCities);
  }, [dataDataAdress]);
  
  
  useEffect(() => {
    if (dataDataAdress && dataDataAdress.length > 0) {
      listCity();
    }
  }, [listCity, dataDataAdress]);

  const listDistrict = useCallback((selectedCity) => {
    if (selectedCity.length > 0) {
      const uniqueDistricts = dataDataAdress
        .filter(item => item !== undefined && item["Tình/ Thành Phố"])
        .filter(item => {
          const cityName = item["Tình/ Thành Phố"]
            .replace(/Tỉnh|Thành phố/g, '')
            .trim();
          return cityName === selectedCity;
        })
        .map(item => item["Quận/ Huyện"])
        .filter(district => district !== undefined && district !== null);
  
      const distinctDistricts = [...new Set(uniqueDistricts)];
  
      setListDistrictEnums(distinctDistricts);
      return distinctDistricts;
    }
    return '';
  }, [dataDataAdress]);
  
  const listCommunesWards = useCallback((selectedCity, selectedDistrict) => {
    if (selectedCity.length > 0 && selectedDistrict.length > 0) {
      const uniqueCommunesWards = dataDataAdress
        .filter(item => item !== undefined && item["Tình/ Thành Phố"])
        .filter(item => {
          const cityName = item["Tình/ Thành Phố"]
            .replace(/Tỉnh|Thành phố/g, '')
            .trim();
          return cityName === selectedCity;
        })
        .filter(item => {
          const districtName = item["Quận/ Huyện"]
          return districtName === selectedDistrict;
        })
        .map(item => item["Tên"])
        .filter(district => district !== undefined && district !== null);
  
      const distinctCommunesWards = [...new Set(uniqueCommunesWards)];
  
      setListCommunesWardsEnums(distinctCommunesWards);
      return distinctCommunesWards;
    }
    return '';
  }, [dataDataAdress]);
  
   // Hàm cập nhật enum trong JSON Schema
   const updateJsonSchemaEnums = useCallback(() => {
    if (jsonSchemaAccountDetails) {
      const updatedSchema = { ...jsonSchemaAccountDetails};

      // Cập nhật enum cho Tỉnh/Thành phố
      if (listCityEnums.length > 0) {
        updatedSchema.properties.userProvinceCity.enum = listCityEnums;
        console.log(formData)
      }

      // Cập nhật enum cho Quận/Huyện
      if (listDistrictEnums.length > 0) {
        updatedSchema.properties.userDistrict.enum = listDistrictEnums;
      } else {
        updatedSchema.properties.userDistrict.enum = [];
      }

      // Cập nhật enum cho Phường/Xã
      if (listCommunesWardsEnums.length > 0) {
        updatedSchema.properties.userWardsACommunes.enum = listCommunesWardsEnums;
      } else {
        updatedSchema.properties.userWardsACommunes.enum = [];
      }
     // So sánh updatedSchema với jsonSchemaAccountDetails hiện tại
      if (JSON.stringify(updatedSchema) !== JSON.stringify(jsonSchemaAccountDetails)) {
        setJonSchemaAccountDetails(updatedSchema);
      }
      if (listCityEnums.length > 0) {
        setIsFormReady(true);
      }
      return null;
    }
  }, [jsonSchemaAccountDetails, listCityEnums, listDistrictEnums, listCommunesWardsEnums, formData]);

  useEffect(() => {
    updateJsonSchemaEnums();
  }, [updateJsonSchemaEnums]);

  const handleFormChange = useCallback(({ formData }) => {
    // Lấy giá trị hiện tại của các trường trong form
    const currentCity = formData.userProvinceCity || '';
    const currentDistrict = formData.userDistrict || '';
  
    // Xử lý thay đổi cho Tỉnh/Thành phố
    if (currentCity !== selectedCity) {
      setSelectedDistrict('');
      setSelectedCity(currentCity);
      listDistrict(currentCity);
      const districtEnum = listDistrictEnums; 
      const updatedSchema = { 
        ...formData,
        userDistrict: { 
          enum: districtEnum || []
        },
        userWardsACommunes: ''
      };
      setFormData(updatedSchema);
    }
  
    // Xử lý thay đổi cho Quận/Huyện
    if (currentDistrict !== selectedDistrict) {
      setSelectedDistrict(currentDistrict);
      listCommunesWards(currentCity, currentDistrict);
      const communesWardsEnum = listCommunesWardsEnums;
      const updatedSchema = { 
        ...formData,
        userWardsACommunes: { 
          enum: communesWardsEnum || [] 
        } 
      };
      setFormData(updatedSchema);
    }
  
  }, [selectedCity, selectedDistrict, listDistrictEnums, listDistrict, listCommunesWards, listCommunesWardsEnums]);
  
  if (!isFormReady) {
    return <LoadingPage />; 
  }

  return (
    <div className={styles.center_wrapper}>
      <div className={styles.overlay_container}>
        <button className={styles.closeAccountDetailsBtn} onClick={handleCloseAccountClick}>x</button>
        <div className={styles.overlay_content}>
          <div className={styles.container_form}>
            <Form
              className={styles.custom_form}
              schema={jsonSchemaAccountDetails}
              validator={validator}
              onChange={handleFormChange}
              formData={formData}
              uiSchema={uiSchemaAccountDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
