import monnifyConfig from '../config/monnify';
import getAxiosInstance from './monnifyHttp';
import apiEndpoint from '../config/apiEndpoint';

/**
 * @method  reserveAccount
 * @param {string} name - The name of the user to reserve an account for
 * @param {string} email - The user's email
 * @returns {json} Formatted JSON server response
 */
async function reserveAccount(name, email) {
  const accountDetails = {
    accountReference: `${name}'s reserved-account`,
    accountName: name,
    currencyCode: 'NGN',
    contractCode: monnifyConfig.contractCode,
    customerEmail: email,
    customerName: name,
  };

  const axiosInstance = await getAxiosInstance();

  const { data } = await axiosInstance.post(
    apiEndpoint.RESERVE_ACCOUNT_NUMBER,
    accountDetails,
  );

  return data;
  // The response from the above
  /*
    {
      requestSuccessful: true,
      responseMessage: 'success',
      responseCode: '0',
      responseBody: {
        contractCode: '2973248496',
        accountReference: "Esho, Tolulope's reserved-account",
        accountName: 'Esho, Tolulope',
        currencyCode: 'NGN',
        customerEmail: 'esho.tolu@edustripe.com',
        customerName: 'Esho, Tolulope',
        accountNumber: '4000047339',
        bankName: 'Providus Bank',
        bankCode: '101',
        collectionChannel: 'RESERVED_ACCOUNT',
        reservationReference: 'XJWVJ5V9WTLJWT3CLD74',
        reservedAccountType: 'GENERAL',
        status: 'ACTIVE',
        createdOn: '2020-08-22 17:12:55.411',
        incomeSplitConfig: [],
        restrictPaymentSource: false
      }
    }
  */
}

export default {
  reserveAccount,
};
