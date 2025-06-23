// utils/otpStore.js

const otpStore = {};

module.exports = {
  setOtp(phone, otp) {
    otpStore[phone] = otp;
  },
  getOtp(phone) {
    return otpStore[phone];
  },
  clearOtp(phone) {
    delete otpStore[phone];
  },
};
