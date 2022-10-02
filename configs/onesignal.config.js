console.log("hello",process.env.one_signal_app_id,process.env.one_signal_app_key)
const one_signal = {
  app_id: process.env.one_signal_app_id,
  app_key: process.env.one_signal_app_key
};

module.exports ={one_signal};