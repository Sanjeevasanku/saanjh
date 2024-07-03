const { patient } = require("../schema.js");

const addPatient = async (req, res) => {
  const { fullName, email, phoneNumber, birthDate, gender, bloodGroup } = req.body;

  let newPatient = new patient({
    fullName,
    email,
    phoneNumber,
    birthDate,
    gender,
    bloodGroup,
    file: req.file.filename
  });

  try {
    newPatient = await newPatient.save();
    res.json({ status: 'ok', data: newPatient });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { addPatient };
