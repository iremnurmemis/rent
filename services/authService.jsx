import axios from 'axios';

export const login = async (email, password) => {
  const loginData = { email, password };

  try {
      const response = await axios.post("http://localhost:5153/api/Auths/login", loginData, {
          withCredentials: true,
      });
      return response.data;
  } catch (error) {
      if (error.response) {
          throw new Error(error.response.data.message || 'Bir hata oluştu');
      } else if (error.request) {
          throw new Error('Sunucuya bağlanılamadı');
      } else {
          throw new Error(error.message || 'Bir hata oluştu');
      }
  }
};


export const adminLogin = async (email, password) => {
  const loginData = { email, password };

  try {
      const response = await axios.post("http://localhost:5153/api/Auths/admin/login", loginData, {
          withCredentials: true,
      });
      return response.data;
  } catch (error) {
      if (error.response) {
          throw new Error(error.response.data.message || 'Bir hata oluştu');
      } else if (error.request) {
          throw new Error('Sunucuya bağlanılamadı');
      } else {
          throw new Error(error.message || 'Bir hata oluştu');
      }
  }
};


export const signUp = async (email, password, firstName, lastName, phoneNumber) => {
  const signUpData = { email, password, firstName, lastName, phoneNumber };

  console.log("Gönderilen veri:", signUpData); // Veriyi kontrol et
  try {
    const response = await axios.post("http://localhost:5153/api/Auths/register", signUpData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Bir hata oluştu");
    } else if (error.request) {
      throw new Error("Sunucuya bağlanılamadı");
    } else {
      throw new Error(error.message || "Bir hata oluştu");
    }
  }
};

export const logout = async () => {
  try {
      await axios.post("http://localhost:5153/api/Auths/logout", {}, {
          withCredentials: true, 
      });
      alert("Çıkış yapıldı");
  } catch (error) {
      console.error("Çıkış sırasında bir hata oluştu:", error);
  }
};

export const changePassword = async (email, currentPassword, newPassword) => {
  const passwordData = { email, currentPassword, newPassword };

  console.log("Gönderilen veri:", passwordData);

  try {
    const response = await axios.post("http://localhost:5153/api/Auths/change-password", passwordData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("API Hatası:", error.response.data);
      throw new Error(error.response.data.message || "Bir hata oluştu");
    } else if (error.request) {
      throw new Error("Sunucuya bağlanılamadı");
    } else {
      throw new Error(error.message || "Bir hata oluştu");
    }
  }
};

 export const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post(
        `http://localhost:5153/api/Auths/request-password-reset?email=${encodeURIComponent(email)}`
      );
      return response.data; // Backend'in döndürdüğü mesajı alıyoruz
    } catch (error) {
      throw new Error(error.response?.data?.message || "Bir hata oluştu");
    }
  };

export const resetPassword = async (email, token, newPassword) => {
  const resetPasswordData = { email, token, newPassword };

  console.log("Şifre sıfırlama verisi gönderiliyor:", resetPasswordData); // Veriyi kontrol et
  try {
    const response = await axios.post("http://localhost:5153/api/Auths/reset-password", resetPasswordData);
    return response.data;  // Backend'den gelen başarı mesajı
  } catch (error) {
    if (error.response) {
      console.log("API Hatası:", error.response.data);
      throw new Error(error.response.data.message || "Bir hata oluştu");
    } else if (error.request) {
      throw new Error("Sunucuya bağlanılamadı");
    } else {
      throw new Error(error.message || "Bir hata oluştu");
    }
  }
};