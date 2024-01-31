// eslint-disable-next-line
const { ObjectId } = require('mongodb')

const exampleCollection1 = {
  title: 'Example Collection',
  _id: ObjectId(),
  type: 'Collection',
  bookmarks: [
    {
      _id: ObjectId(),
      url: 'https://webmail.apps.mil/',
      label: 'Webmail',
      cmsId: 'ckwz3tphw1763ql97pia1zkvc',
    },
    {
      _id: ObjectId(),
      url: 'https://mypay.dfas.mil/#/',
      label: 'MyPay',
      cmsId: 'cktd7hjz30636w5977vu4la4c',
    },
    {
      _id: ObjectId(),
      url: 'https://afpcsecure.us.af.mil/PKI/MainMenu1.aspx',
      label: 'vMPF',
      cmsId: 'cktd7c0d30190w597qoftevq1',
    },
    {
      _id: ObjectId(),
      url: 'https://leave.af.mil/profile',
      label: 'LeaveWeb',
      cmsId: 'cktd7ettn0457w597p7ja4uye',
    },
    {
      _id: ObjectId(),
      url: 'https://mypers.af.mil',
      label: 'EPRs/OPRs',
      cmsId: 'cktd7anq40068w597xloypsez',
    },
  ],
}

const exampleCollection2 = {
  title: 'Second Collection',
  _id: ObjectId(),
  type: 'Collection',
  bookmarks: [
    {
      _id: ObjectId(),
      url: 'https://google.com',
      label: 'Search Engine',
    },
  ],
}

const exampleCollection3 = {
  title: 'Third Collection',
  _id: ObjectId(),
  type: 'Collection',
  bookmarks: [
    {
      _id: ObjectId(),
      url: 'https://google.com',
      label: 'Search Engine',
    },
    {
      _id: ObjectId(),
      url: 'https://google.com',
      label: 'Webmail',
    },
    {
      _id: ObjectId(),
      url: 'https://mypay.dfas.mil/#/',
      label: 'MyPay',
      cmsId: 'cktd7hjz30636w5977vu4la4c',
    },
  ],
}

// These users need to exist in the test IDP users.php file
// because Cypress tests authenticate using the test IDP
module.exports.testUser1 = {
  userId: 'CAMPBELL.BERNADETTE.5244446289',
  mySpace: [exampleCollection1, exampleCollection2],
  displayName: 'Bernie',
  theme: 'light',
}

module.exports.testUser2 = {
  userId: 'BOYD.RONALD.312969168',
  mySpace: [exampleCollection3],
  displayName: 'Ronny',
  theme: 'light',
}
