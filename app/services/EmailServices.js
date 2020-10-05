import fs from 'fs';
import ejs from 'ejs';
import util from 'util';
import path from 'path';
import 'dotenv/config';
import nodemailer from 'nodemailer';

const readFileAsync = util.promisify(fs.readFile);
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
  async init(fileName) {
    this.mailTemplates = await readFileAsync(
      path.join(templatesDirectory, `${fileName}.html`),
      'utf-8'
    );
  }

  /**
   * @function sendEmail
   * @description A nodemailer function to send mails
   * @param {object} options - The options object
   * @param {object} data - The request data object
   * @returns {object} Returns a JSON API response
   */
  sendEmail(options, data) {
    let { recipients, from, subject, text, html } = options;
    data = data || {};
    if (!(recipients && subject && html)) {
      // eslint-disable-next-line nonblock-statement-body-position
      throw Error('Provide required options');
    }
    let to = recipients;
    if (Array.isArray(to)) {
      to = to.join(',');
    }

    html = ejs.render(html, data);

    options.from = from || process.env.defaultSender;
    options.text = text || html;
    options.html = html;
    options.to = to;

    // send mail with defined transport object
    this.transporter.sendMail(options, (error) => {
      if (error) {
        throw Error(error);
      }

      // eslint-disable-next-line no-console
      console.log('Message sent!');
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
  async sendTestMail(firstname, messageFile, email) {
    await this.init(messageFile);
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
}
