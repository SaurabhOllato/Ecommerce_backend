// utils/otpStore.js

// const otpStore = {};

// module.exports = {
//   setOtp(phone, otp) {
//     otpStore[phone] = otp;
//   },
//   getOtp(phone) {
//     return otpStore[phone];
//   },
//   clearOtp(phone) {
//     delete otpStore[phone];
//   },
// };

const otpMap = new Map();

function setOtp(phone, otp) {
  otpMap.set(phone,{ otp, createdAt: Date.now()});
}

function getOtp(phone) {
  const data = otpMap.get(phone);
  if(!data) return null;

  const isExpired = Date.now() - data.createdAt > 5 * 60 * 1000; 
  return isExpired ? null : data.otp;
}

function clearOtp(phone) {
  otpMap.delete(phone);
}

module.exports = {setOtp, getOtp, clearOtp};
