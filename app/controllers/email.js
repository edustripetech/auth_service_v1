import EmailService from '../services/EmailServices';
/**
 * @name sendTestMail
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} JSON response
 */
const sendTestMail = async (req, res) => {
  const { name, email } = req.params;
  try {
    await new EmailService().sendTestMail(name, 'test', email);
    return res.send({ message: 'Email Sent' });
  } catch (error) {
    console.log(error);
  }
};

export default {
  sendTestMail,
};
