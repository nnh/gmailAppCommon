/**
 * Sends an email with options.
 * @param {string} mailAddress - The email address.
 * @param {string} title - The email subject.
 * @param {string} body - The email body.
 * @param {Map} inputOptions - Additional options for the email.
 * @returns {void}
 * @throws {Error} If any required parameter is not specified or if the email fails to send.
 */
function sendEmailWithOptions_(
  mailAddress,
  title,
  body,
  inputOptions = new Map()
) {
  const options = editOptions_(inputOptions);

  if (!utilsLibrary.isString(mailAddress) || mailAddress.length === 0) {
    throw new Error('The email address is not specified.');
  }

  if (!utilsLibrary.isString(title) || title.length === 0) {
    throw new Error('The email subject is not specified.');
  }

  if (!utilsLibrary.isString(body) || body.length === 0) {
    throw new Error('The email body is not specified.');
  }

  try {
    GmailApp.sendEmail(mailAddress, title, body, options);
  } catch (error) {
    throw new Error('Failed to send the email.');
  }
}

/**
 * Edits the options for the email.
 * @param {Map} inputOptions - The input options for the email.
 * @returns {Object} The edited options.
 */
function editOptions_(inputOptions) {
  const options = {};

  // attachments
  const fileIdList = inputOptions.has('fileIdList')
    ? inputOptions.get('fileIdList')
    : null;
  if (fileIdList !== null) {
    const fileList = [];
    const fileIdArray = Array.isArray(fileIdList) ? fileIdList : [fileIdList];
    fileIdArray.forEach(([fileId, mimeType]) => {
      // Send an email with a file from Google Drive attached as a PDF.
      const res = driveCommon.getFileById(fileId);
      if (!utilsLibrary.isObject(res)) {
        console.log(`${res}|fileId:${fileId}`);
      } else {
        fileList.push(res.getAs(mimeType));
      }
    });

    if (fileList.length > 0) {
      options.attachments = fileList;
    }
  }

  // noReply
  if (inputOptions.has('noReply')) {
    const noReply = inputOptions.get('noReply');
    if (utilsLibrary.isBoolean(noReply)) {
      options.noReply = noReply;
    }

    if (!noReply && inputOptions.has('name')) {
      const name = inputOptions.get('name');
      if (utilsLibrary.isString(name)) {
        options.name = name;
      }
    }
  }

  return options;
}
