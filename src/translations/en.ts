// All guidelines for the translations can be found in the file README.md
export const en = {
  'app.api-testing.label': 'API testing',
  'app.definition.description': `This web application is used to show how candidate products align with
    the technical specifications that have been developed by [Govstack](https://www.govstack.global/)
    for various [Building Blocks](https://govstack.gitbook.io/specification/). For each
    Building Blocks a series of APIs have been defined and tests have been developed which any compliant
    product must be able to pass. These tests are run against candidate platforms and this application 
    provides detailed information on which tests are passing and which are failing. Users may select any
    building block that they are interested and view candidate products as well as their current level
    of compliance with the API.`,
  'app.definition.note':
    'Note: Technical/API compliance is only a part of the full GovStack compliance process',
  'app.definition.title': 'GovStack Building Block Compliance Platform',
  'app.error_fetching_data.message':
    'Error fetching data. Please try again later.',
  'app.help.label': 'Help',
  'app.tests_passed.label': 'Tests Passed',
  'app.tests_failed.label': 'Tests Failed',
  'app.compatibility.label': 'Compatibility',
  'app.scroll-loader.message': 'Loading more data...',
  'app.scenario.label': 'Scenario:',
  'app.search': 'Software Name',
  'app.software-compliance-testing.label': 'Software Compliance Testing',

  'building_block.label': 'Building Block',
  'building_block.plural.label': 'Building Blocks',

  'image.alt.logoFor': 'Logo for: {name}',

  'software_name.label': 'Software Name',

  'result_page.back_to_product_list': '< Back to Products List',
  'result_page.title': 'Tests for',

  'table.last_update.label': 'Last Update',
  'table.no_result_count.message': 'No results count found',
  'table.overall_compatibility.label': 'Overall Compatibility',
  'table.result.label': ' result',
  'table.result.plural.label': ' results',

  'test_table.category.label': 'Category',
  'test_table.failed': 'Failed',
  'test_table.last_update.label': 'Last update:',
  'test_table.name.label': 'Name',
  'test_table.passed': 'Passed',
  'test_table.status.label': 'Status',

  // ---------------------------------------------------------------------
  // This is translation for each building block
  'bb-cloud-infrastructure-hosting': 'Cloud and Infrastructure Hosting',
  'bb-consent': 'Consent management',
  'bb-digital-registries': 'Digital Registries',
  'bb-emarketplace': 'eMarketplace',
  'bb-esignature': 'eSignature',
  'bb-gis': 'Geographic Information System (GIS)',
  'bb-identity': 'Identification and Authentication',
  'bb-information-mediator': 'Information Mediator',
  'bb-messaging': 'Messaging',
  'bb-payments': 'Payments',
  'bb-registration': 'Registration',
  'bb-schedular': 'Schedular',
  'bb-ux': 'User Experience (UI/UX)',
  'bb-workflow': 'Workflow Engine',
};
