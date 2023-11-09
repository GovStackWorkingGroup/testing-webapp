// Urls
export const COMPLIANCE_TESTING_DETAILS_PAGE =
  'softwareComplianceTesting/details/';
export const COMPLIANCE_TESTING_FORM = '/softwareComplianceTesting/form';
export const COMPLIANCE_TESTING_RESULT_PAGE = '/softwareComplianceTesting';

export const complianceTEST = [
  {
    softwareVersion: '2.0',
    bbDetails: [
      {
        bbName: 'bb-payments',
        bbVersions: [
          {
            bbVersion: '1.2.0',
            requirements: {
              level: 1,
              crossCuttingRequirements: [
                {
                  requirement: 'Req1',
                  comment: 'Comment1',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'Req2',
                  comment: 'Comment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'Req3',
                  comment: 'Comment3',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'Req4',
                  comment: 'Comment4',
                  fulfillment: 0,
                  status: 0,
                },
                {
                  requirement: 'Req5',
                  comment: 'Comment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
              functionalRequirements: [
                {
                  requirement: 'FuncReq1',
                  comment: 'FuncComment1',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'FuncReq2',
                  comment: 'FuncComment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'FuncReq3',
                  comment: 'FuncComment3',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'FuncReq4',
                  comment: 'FuncComment4',
                  fulfillment: 0,
                  status: 2,
                },
                {
                  requirement: 'FuncReq5',
                  comment: 'FuncComment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
            },
            interface: {
              level: -1,
              note: 'NoteC',
            },
          },
          {
            bbVersion: '1.2.0',
            requirements: {
              level: 1,
              crossCuttingRequirements: [
                {
                  requirement: 'Req1',
                  comment: 'Comment1',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'Req2',
                  comment: 'Comment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'Req3',
                  comment: 'Comment3',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'Req4',
                  comment: 'Comment4',
                  fulfillment: 0,
                  status: 0,
                },
                {
                  requirement: 'Req5',
                  comment: 'Comment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
              functionalRequirements: [
                {
                  requirement: 'FuncReq1',
                  comment: 'FuncComment1',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'FuncReq2',
                  comment: 'FuncComment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'FuncReq3',
                  comment: 'FuncComment3',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'FuncReq4',
                  comment: 'FuncComment4',
                  fulfillment: 0,
                  status: 2,
                },
                {
                  requirement: 'FuncReq5',
                  comment: 'FuncComment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
            },
            interface: {
              level: -1,
              note: 'NoteC',
            },
          },
        ],
      },
      {
        bbName: 'bb-digital-registries',
        bbVersions: [
          {
            bbVersion: '1.2.0',
            requirements: {
              level: 1,
              crossCuttingRequirements: [
                {
                  requirement: 'Req1',
                  comment: 'Comment1',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'Req2',
                  comment: 'Comment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'Req3',
                  comment: 'Comment3',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'Req4',
                  comment: 'Comment4',
                  fulfillment: 0,
                  status: 0,
                },
                {
                  requirement: 'Req5',
                  comment: 'Comment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
              functionalRequirements: [
                {
                  requirement: 'FuncReq1',
                  comment: 'FuncComment1',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'FuncReq2',
                  comment: 'FuncComment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'FuncReq3',
                  comment: 'FuncComment3',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'FuncReq4',
                  comment: 'FuncComment4',
                  fulfillment: 0,
                  status: 2,
                },
                {
                  requirement: 'FuncReq5',
                  comment: 'FuncComment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
            },
            interface: {
              level: 2,
              testHarnessResult: 'ResultA',
              requirements: [
                {
                  requirement: 'InterReq1',
                  comment: 'InterComment1',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'InterReq2',
                  comment: 'InterComment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'InterReq3',
                  comment: 'InterComment3',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'InterReq4',
                  comment: 'InterComment4',
                  fulfillment: 0,
                  status: 0,
                },
                {
                  requirement: 'InterReq5',
                  comment: 'InterComment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
            },
          },
          {
            bbVersion: '1.4.0',
            requirements: {
              level: 1,
              crossCuttingRequirements: [
                {
                  requirement: 'Req1',
                  comment: 'Comment1',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'Req2',
                  comment: 'Comment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'Req3',
                  comment: 'Comment3',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'Req4',
                  comment: 'Comment4',
                  fulfillment: 0,
                  status: 0,
                },
                {
                  requirement: 'Req5',
                  comment: 'Comment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
              functionalRequirements: [
                {
                  requirement: 'FuncReq1',
                  comment: 'FuncComment1',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'FuncReq2',
                  comment: 'FuncComment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'FuncReq3',
                  comment: 'FuncComment3',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'FuncReq4',
                  comment: 'FuncComment4',
                  fulfillment: 0,
                  status: 2,
                },
                {
                  requirement: 'FuncReq5',
                  comment: 'FuncComment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
            },
            interface: {
              level: 2,
              testHarnessResult: 'ResultA',
              requirements: [
                {
                  requirement: 'InterReq1',
                  comment: 'InterComment1',
                  fulfillment: 1,
                  status: 0,
                },
                {
                  requirement: 'InterReq2',
                  comment: 'InterComment2',
                  fulfillment: 0,
                  status: 1,
                },
                {
                  requirement: 'InterReq3',
                  comment: 'InterComment3',
                  fulfillment: 1,
                  status: 2,
                },
                {
                  requirement: 'InterReq4',
                  comment: 'InterComment4',
                  fulfillment: 0,
                  status: 0,
                },
                {
                  requirement: 'InterReq5',
                  comment: 'InterComment5',
                  fulfillment: 1,
                  status: 1,
                },
              ],
            },
          },
        ],
      },
      {
        bbName: 'bb-messaging',
        bbVersions: [
          {
            bbVersion: '2.0.0',
            requirements: {
              level: 2,
              note: 'NoteD',
            },
            interface: {
              level: 1,
              note: 'Updated Note',
            },
          },
          {
            bbVersion: '2.0.0',
            requirements: {
              level: 2,
              note: 'NoteD',
            },
            interface: {
              level: 1,
              note: 'Updated Note',
            },
          },
        ],
      },
    ],
  },
  {
    softwareVersion: '2.1',
    bbDetails: [
      {
        bbName: 'bb-digital-registries',
        bbVersions: [
          {
            bbVersion: '1.2.1',
            requirements: {
              level: 1,
              note: 'Updated Note',
            },
            interface: {
              level: 2,
              note: 'Updated Note',
            },
          },
          {
            bbVersion: '1.2.1',
            requirements: {
              level: 1,
              note: 'Updated Note',
            },
            interface: {
              level: 2,
              note: 'Updated Note',
            },
          },
        ],
      },
      {
        bbName: 'bb-payments',
        bbVersions: [
          {
            bbVersion: '1.1.3',
            requirements: {
              level: 2,
              note: 'NoteD',
            },
            interface: {
              level: -1,
              note: 'Updated Note',
            },
          },
          {
            bbVersion: '1.1.3',
            requirements: {
              level: 2,
              note: 'NoteD',
            },
            interface: {
              level: -1,
              note: 'Updated Note',
            },
          },
        ],
      },
      {
        bbName: 'bb-messaging',
        bbVersions: [
          {
            bbVersion: '2.0.1',
            requirements: {
              level: 2,
              note: 'Updated Note',
            },
            interface: {
              level: -1,
              note: 'Updated Note',
            },
          },
          {
            bbVersion: '2.0.1',
            requirements: {
              level: 2,
              note: 'Updated Note',
            },
            interface: {
              level: -1,
              note: 'Updated Note',
            },
          },
        ],
      },
    ],
  },
];
