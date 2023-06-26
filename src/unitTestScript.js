/**
 * Executes the test cases for email with different combinations of title, body, and email address.
 * @returns {void}
 */
function executeTitleBodyEmailTests() {
  const [mailAddress, title, body] = new EmailContent().getEmailContent();
  const ngTextList = ['', null];
  const titleBodyMailNg = ngTextList.flatMap(ngText => [
    [mailAddress, title, ngText],
    [mailAddress, ngText, body],
    [ngText, title, body],
  ]);

  const titleBodyMailResNg = titleBodyMailNg.map(([mail, t, b]) => {
    try {
      sendEmailWithOptions_(mail, t, b);
    } catch (error) {
      return error;
    }
    return true;
  });

  if (titleBodyMailResNg.includes(true)) {
    console.log('Test NG: exceptional case - Title, Body, or Email Address');
    console.log(titleBodyMailResNg);
    return;
  }

  try {
    sendEmailWithOptions_(mailAddress, title, body);
  } catch (error) {
    console.log('Test NG: normal case - Title, Body, Email Address');
    return;
  }

  console.log('Test Passed: Title, Body, Email Address');
}

class EmailContent {
  constructor() {
    this.mailAddress = Session.getActiveUser().getEmail();
    this.defaultTitle = 'titleTest';
    this.defaultBody = 'bodyTest';
  }

  getEmailContent(title = this.defaultTitle, body = this.defaultBody) {
    return [this.mailAddress, title, body];
  }
}

/**
 * Executes the test cases for noReply and name options.
 * @returns {void}
 */
function executeNoReplyAndNameTests() {
  const targetParameters = [
    [true, null, 'noreply as email sender'],
    [false, 'test-name', 'test-name as email sender name'],
  ];

  const emailContent = new EmailContent();

  const results = targetParameters.map(([noReply, name, body]) => {
    const contents = emailContent.getEmailContent(
      emailContent.defaultTitle,
      body
    );

    const options = setNoReplyAndName_(noReply, name);

    try {
      sendEmailWithOptions_(...contents, options);
    } catch (error) {
      throw new Error('Test NG: noReply or name.');
    }

    Utilities.sleep(1000);
    return true;
  });

  if (results.every(x => x === true)) {
    console.log('Test Passed: noReply, name.');
  }
}

/**
 * Sets the noReply and name options in the options Map.
 * @param {boolean|null} noReply - The noReply option.
 * @param {string|null} name - The name option.
 * @param {Map} options - The options Map.
 * @returns {Map} The modified options Map.
 */
function setNoReplyAndName_(noReply, name, options = new Map()) {
  if (noReply !== null) {
    options.set('noReply', noReply);
  }
  if (name !== null) {
    options.set('name', name);
  }
  return options;
}

function executeSendEmailWithAttachmentsTest() {
  const pdf = [
    PropertiesService.getScriptProperties().getProperty('testPdfId'),
    MimeType.PDF,
  ];
  const jpeg = [
    PropertiesService.getScriptProperties().getProperty('testJpegId'),
    MimeType.JPEG,
  ];
  const emailContent = new EmailContent().getEmailContent();
  const testArrayNg = [[[`testzzzzzz`, MimeType.PDF]]];
  const resNg = testArrayNg.map(attachments => {
    const options = new Map([['fileIdList', attachments]]);
    return execTestSendEmailWithAttachments_(emailContent, options);
  });
  if (resNg.some(x => x !== true)) {
    console.log('Test NG: exceptional case, attachments');
    console.log(resNg);
    return;
  }
  const testArrayOk = [[pdf], [pdf, jpeg]];
  const resOk = testArrayOk.map(attachments => {
    return execTestSendEmailWithAttachments_(
      emailContent,
      new Map([['fileIdList', attachments]])
    );
  });
  if (resOk.every(x => x === true)) {
    console.log('Test Passed: attachments.');
  }
}
function execTestSendEmailWithAttachments_(contents, options) {
  try {
    sendEmailWithOptions_(...contents, options);
    Utilities.sleep(1000);
  } catch (error) {
    return error;
  }
  return true;
}
/**
 * Executes the test cases for sending email with attachments.
 * @returns {void}
 */
function executeSendEmailWithAttachmentsTest() {
  const pdf = [
    PropertiesService.getScriptProperties().getProperty('testPdfId'),
    MimeType.PDF,
  ];
  const jpeg = [
    PropertiesService.getScriptProperties().getProperty('testJpegId'),
    MimeType.JPEG,
  ];
  const emailContent = new EmailContent().getEmailContent();

  const testArrayNg = [[[`testzzzzzz`, MimeType.PDF]]];
  const resNg = testArrayNg.map(attachments => {
    const options = new Map([['fileIdList', attachments]]);
    return sendEmailWithAttachmentsTest_(emailContent, options);
  });

  if (resNg.some(x => x !== true)) {
    console.log('Test NG: exceptional case - attachments');
    console.log(resNg);
    return;
  }

  const testArrayOk = [[pdf], [pdf, jpeg]];
  const resOk = testArrayOk.map(attachments => {
    return sendEmailWithAttachmentsTest_(
      emailContent,
      new Map([['fileIdList', attachments]])
    );
  });

  if (resOk.every(x => x === true)) {
    console.log('Test Passed: attachments.');
  }
}

/**
 * Executes the test case for sending email with attachments.
 * @param {array} contents - The email contents.
 * @param {Map} options - The options Map.
 * @returns {boolean} - Returns true if the email is sent successfully, otherwise returns an error.
 */
function sendEmailWithAttachmentsTest_(contents, options) {
  try {
    sendEmailWithOptions_(...contents, options);
    Utilities.sleep(1000);
  } catch (error) {
    return error;
  }
  return true;
}
