import EmailService from '../services/EmailServices';
/**
 * @name sendTestMail
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @return {Object} JSON response
 */
const sendTestMail = async (req, res) => {
  try {
    await new EmailService().sendTestMail(
      'Emeka',
      'test',
      'emekaofe22@gmail.com'
    );
    return res.send({ message: 'Email Sent' });
  } catch (error) {
    console.log(error);
  }
};

export default {
  sendTestMail,
};
