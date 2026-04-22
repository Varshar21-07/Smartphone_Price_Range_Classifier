import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // FastAPI default

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictSingle = async (specs) => {
  const payload = {
    battery_power: parseInt(specs.battery_power),
    dual_sim: parseInt(specs.dual_sim),
    fc: parseInt(specs.fc),
    four_g: parseInt(specs.four_g),
    int_memory: parseInt(specs.int_memory),
    mobile_wt: parseInt(specs.mobile_wt),
    pc: parseInt(specs.pc),
    px_height: parseInt(specs.px_height),
    px_width: parseInt(specs.px_width),
    ram: parseInt(specs.ram),
    sc_h: parseInt(specs.sc_h),
    sc_w: parseInt(specs.sc_w),
    talk_time: parseInt(specs.talk_time),
  };

  try {
    const response = await api.post('/predict', payload);
    return response.data;
  } catch (error) {
    console.error('Prediction API Error:', error);
    throw error;
  }
};

export const getMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data;
  } catch (error) {
    console.error('Metrics API Error:', error);
    return null;
  }
};

export const getModelInfo = async () => {
  try {
    const response = await api.get('/model-info');
    return response.data;
  } catch (error) {
    console.error('Model Info API Error:', error);
    return null;
  }
};

export const predictBatch = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict-batch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Batch Prediction API Error:', error);
    throw error;
  }
};

export default api;
