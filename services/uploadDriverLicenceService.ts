import axios from 'axios';
import { AxiosError } from 'axios';

export interface DriverLicenceInfo{
  licenceNo: string,
  validUntil:string,
  uploadDate: string
}

export const UploadDriverLicenceService = {
  uploadDriverLicence: async (file: File, userId: number): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("file", file);  
      formData.append("userId", userId.toString());  

      const response = await axios.post(
        "http://localhost:5153/api/DriverLicences/upload-driver-licence",  
        formData,  
        { headers: { "Content-Type": "multipart/form-data" } }  
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('API isteği sırasında bir hata oluştu:', error.response?.data || error.message);
      } else {
        console.log('Beklenmedik bir hata oluştu:', error);
      }
      throw error;
    }
  },

  getUserDriverLicence: async ( userId: number): Promise<DriverLicenceInfo> => {
    try {
      const response = await axios.get(
        "http://localhost:5153/api/DriverLicences/getuserdriverlicenceinfo",  
        {
          params: { userId },
        }   
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('API isteği sırasında bir hata oluştu:', error.response?.data || error.message);
      } else {
        console.log('Beklenmedik bir hata oluştu:', error);
      }
      throw error;
    }
  }
};

