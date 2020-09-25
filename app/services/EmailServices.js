import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import 'dotenv/config';
import nodemailer from 'nodemailer';

const templatesDirectory = path.join(__dirname, './../mail/templates');
/**
 * @class EmailService
 * @classdesc The Email Service class containing methods for sending mail
 */
export default class EmailService {
  /**
   * Constructor for Email Service
   * @constructor
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: process.env.gmailPort,
      secure: false,
      auth: {
        user: process.env.username,
        pass: process.env.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * @function init
   * @description An initial function to parse the template file ssupplied
   * @param {object} fileName - The file name of the html template
   * @returns {string} Returns path to html template
   */
  init(fileName) {
    this.mailTemplates = fs.readFileSync(
      path.join(templatesDirectory, `${fileName}.html`),
      'utf-8',
    );
  }

  /**
   * @function sendEmail
   * @description A nodemailer function to send mails
   * @param {object} options - The options object
   * @param {object} data - The request data object
   * @param {Function} callback - The request data object
   * @returns {object} Returns a JSON API response
   */
  sendEmail(options, data, callback = null) {
    const {
      recipients, from, subject, text, html,
    } = options;
    data = data || {};
    if (!(recipients && subject && html)) {
      // eslint-disable-next-line nonblock-statement-body-position
      throw Error('Provide required options');
    }
    let to = recipients;
    if (Array.isArray(to)) {
      to = to.join(',');
    }

    const body = ejs.render(html, data);

    options.from = from || process.env.defaultSender;
    options.text = text || body;
    options.html = body;
    options.to = to;
    options.subject = subject;

    // send mail with defined transport object
    this.transporter.sendMail(options, (error, info) => {
      if (error) {
        throw Error(error);
      }
      if (callback && {}.toString.call(callback) === '[object Function]') {
        callback(info);
      }
    });
  }

  /**
   * @function sendTestMail
   * @description A function to
   * @param {string} firstname - The first name of recipient
   * @param {file} messageFile - The html message template
   * @param {string} email - The email of recipient
   * @returns {object} Returns a JSON API response
   */
  sendTestMail(firstname, messageFile, email) {
    this.init(messageFile);
    const options = {
      recipients: [email],
      subject: 'Test Mail',
      html: this.mailTemplates,
    };

    const data = {
      firstname,
    };
    this.sendEmail(options, data);
  }

  /**
   * @function sendWelcomeEmail
   * @description A function to
   * @param {Object} user - Recipient
   * @param {string} user.firstName - The first name of recipient
   * @param {string} user.email - The first name of recipient
   * @param {string} verificationUrl - The first name of recipient
   * @param {Function} callback - The first name of recipient
   * @param {string} templateFile - The first name of recipient
   * @returns {object} Returns a JSON API response
   */
  async sendWelcomeEmail(user, verificationUrl, callback, templateFile = 'verify-account') {
    this.init(templateFile);
    const options = {
      recipients: [user.email],
      subject: `${user.firstName}, Welcome to Edustripe`,
      html: this.mailTemplates,
    };

    const data = {
      name: user.firstName,
      verificationUrl,
    };
    this.sendEmail(options, data, callback);
  }
}
