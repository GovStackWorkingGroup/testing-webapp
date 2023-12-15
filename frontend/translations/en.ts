// All guidelines for the translations can be found in the file README.md
export const en = {
  'app.api-testing.label': 'API testing',
  'app.login.label': 'Log In',
  'app.logout.label': 'Log Out',
  'app.back_to_reports_list.label': '< Back to Report List',
  'app.compliance_with.label': 'Compliance with',
  'app.check_compliance.label': 'Check Compliance',
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
  'app.definition_self_assessment.title': 'Self-Assessment of Compliance',
  'app.definition_self_assessment_part_1.description':
    'The Software Requirements Compliance form allows software providers to self-assess their products against the functional requirements that have been developed by GovStack. These assessments help GovStack users validate that a particular software platform is able to meet the functional requirements for one or more Building Blocks, as well as whether it adheres to the cross-functional requirements specified for all GovStack implementations.',
  'app.definition_self_assessment_part_2.description':
    'Click on the ‘Check Compliance’ to start the assessment process for a particular product. For detailed instructions on filling out the self-assessment forms, please refer to [this document](https://govstack-global.atlassian.net/wiki/spaces/GH/pages/376012801/Instructions+for+Software+Requirements+Compliance).',
  'app.edit.label': 'edit',
  'app.email.label': 'Email',
  'app.email_confirm.label': 'Confirm email',
  'app.error_fetching_data.message':
    'Error fetching data. Please try again later.',
  'app.evaluation_schema.label': 'Evaluation Schema',
  'app.evaluation_summary.label': 'Evaluation Summary',
  'app.help.label': 'Help',
  'app.interface_requirement_specification.label':
    'Interface & Requirement Specification Compliance',
  'app.tests_passed.label': 'Tests Passed',
  'app.tests_failed.label': 'Tests Failed',
  'app.compatibility.label': 'Compatibility',
  'app.scroll-loader.message': 'Loading more data...',
  'app.scenario.label': 'Scenario:',
  'app.software_attributes.label': 'Software Attributes',
  'app.software_requirements_compliance.label':
    'Software Requirements Compliance',
  'app.view_report_details.label': 'view report details',

  'building_block.label': 'Building Block',
  'building_block.plural.label': 'Building Blocks',

  'drag_drop.doc_format.label':
    'PDF, word document or plain text files accepted.',
  'drag_drop.image_format.label': 'PNG, JPG or SVG files accepted.',
  'drag_drop.or_drop.label': 'or drag and drop it here',
  'drag_drop.select_file.label': 'Select a file to upload',

  'details_view.bbs_used.label': 'BBs used for Evaluation',
  'details_view.container_description.label':
    'Container that show that the product can be run in a container system (usually Docker and/or Kubernetes)',
  'details_view.documentation_description.label':
    'Documentation on how to install and deploy software',

  'evaluation_schema.all.label': 'All',
  'evaluation_schema.compliance.label': 'Compliance',
  'evaluation_schema.deployability_via_container.label':
    'Deployability via container',
  'evaluation_schema.equal_or_more_than_1.label': '≥ 1',
  'evaluation_schema.fulfillment.label': 'Fulfillment',
  'evaluation_schema.fulfillment_of_required_api.label':
    'Fulfillment of REQUIRED API related requirements in the Architecture BB specifications',
  'evaluation_schema.fulfillment_of_required_key.label':
    'Fulfillment of REQUIRED Key Digital Functionalities stated in the respective BB specifications',
  'evaluation_schema.fulfillment_of_required_functional_requirements.label':
    'Fulfillment of REQUIRED cross-cutting and functional requirements stated in the respective BB specifications',
  'evaluation_schema.fulfillment_of_required_cross_cutting_requirements.label':
    'Fulfillment of REQUIRED cross-cutting requirements stated in the Architecture BB specifications',
  'evaluation_schema.fulfillment_of_service_api.label':
    'Fulfillment of Service API requirements',
  'evaluation_schema.level_1.label': 'Level 1',
  'evaluation_schema.level_2.label': 'Level 2',
  'evaluation_schema.optional.label': 'Optional',
  'evaluation_schema.comment.label': 'Comment',
  'evaluation_schema.requirement.label': 'Requirement',
  'evaluation_schema.requirement_specification.label':
    'Requirement Specification',

  'form.container.label': 'Container',
  'form.copied_to_clipboard.message': 'Link copied to clipboard!',
  'form.cross_cutting_requirements.label': 'Cross-Cutting Requirements',
  'form.deployment_instruction.message':
    'Please provide links to documentation on how to install and deploy this product as well as links to Docker files or other files that show that the product can be run in a container system (usually Docker and/or Kubernetes). You can also directly upload files instead of providing links.',
  'form.error_loading_file.message': 'Error loading file. Please try again.',
  'form.evaluation_summary_title.label':
    'Make sure all data entered is correct',
  'form.file.label': 'File',
  'form.fill_in_all_the_fields_below.label': 'Fill in all the fields below.',
  'form.filled_compliance_form.label': 'Filled Compliance Forms',
  'form.filling_required.label': 'Filling this form is required.',
  'form.functional_requirements.label': 'Functional Requirements',
  'form.header.comment.label': 'Comment',
  'form.header.fulfillment.label': 'Fulfillment',
  'form.header.requirement.label': 'Requirement',
  'form.fill_in_at_least_1_of_the_below_forms.label':
    'Fill in at least 1 of the below forms',
  'form.form_invalid.message':
    'To proceed you must fill in all the required fields.',
  'form.invalid_email.message': 'Invalid email address.',
  'form.invalid_email_match.message': 'Email addresses do not match.',
  'form.invalid_doc_file_format.message':
    'Invalid file format. Please select a PDF, word document, or plain text file.',
  'form.invalid_image_file_format.message':
    'Invalid file format. Please select a PNG, JPG, or SVG file.',
  'form.link.label': 'Link',
  'form.required_field.message': 'This field is required.',
  'form.form_submit_error.message': 'Draft submitting failed',
  'form.form_saved_success.message': 'Draft saved successfully',
  'form.form_saved_error.message': 'Draft saving failed',
  'form.form_submit_success.message': 'Form has been successfully submitted!',
  'form.form_submit_success_inform.message':
    'We will inform you about the progress of the process via email provided in the form. You can also use this unique link to follow the progress:',
  'form.point_of_contact.label': 'Point of contact',
  'form.clear_selection.label': 'Clear selection',
  'form.select_building_blocks.label':
    'Select at least one Building Block for which compliance you want to check. You can test more than one Building Block at a time.',
  'form.required_label': 'Required',
  'form.test_harness.title.label': 'Test Harness Result',
  'form.table.title.label': 'Architectural Cross-Cutting Requirements',
  'form.test_harness.tip_message.label':
    'Paste link link to test harness result.',
  'form.tip_description.label': 'Provide description of your software.',
  'form.tip_documentation.label': 'Paste link to your documentation.',
  'form.tip_max_characters.label': '400 characters max.',
  'form.tip_paste_link_container.label': 'Paste link to the container.',
  'form.tip_paste_link_documentation.label': 'Paste link to the documentation.',
  'form.tip_website.label': 'Paste link to your website.',
  'form.software_version.label': 'Software Version',
  'form.question_line.not_sure_how_to_start': 'Not sure how to start? ',
  'form.question_line.click': 'Click ',
  'form.question_line.here': 'here',
  'form.question_line.and_see_instructions_on_how_to_configure_interface_compliance':
    ' and see instructions on how to configure interface compliance.',

  'image.alt.logoFor': 'Logo for: {name}',

  'software_documentation.label': 'Software Documentation',
  'software_description.label': 'Tool Description',
  'software_logo.label': 'Software Logo',
  'software_name.label': 'Software Name',
  'software_website.label': 'Software Website',

  'progress_bar.next.label': 'Next',
  'progress_bar.previous_step.label': 'Previous Step',
  'progress_bar.submit_form.label': 'Submit Form',
  'progress_bar.save_draft.label': 'Save draft',

  'result_page.back_to_product_list': '< Back to Products List',
  'result_page.title': 'Tests for',

  'table.approved.label': 'Approved',
  'table.bb_specification.label': 'BB Specification',
  'table.bb_version.label': 'BB Version',
  'table.building_block_version.label': 'Building Block Version',
  'table.compliance.label': 'Compliance',
  'table.compliance_level.label': 'Compliance Level',
  'table.deployable.label': 'Deployable',
  'table.deployment.label': 'Deployment',
  'table.deployment_compliance.label': 'Deployment Compliance',
  'table.documentation.label': 'Documentation',
  'table.draft.label': 'Draft',
  'table.hide_older_versions.label': 'Hide older versions',
  'table.interface.label': 'Interface',
  'table.interface_compliance.label': 'Interface Compliance',
  'table.in_review.label': 'In Review',
  'table.last_update.label': 'Last Update',
  'table.level_1.label': 'Level 1',
  'table.level_2.label': 'Level 2',
  'table.logo.label': 'Logo',
  'table.N/A.label': 'N/A',
  'table.no_data_available.message': 'No Data Available',
  'table.no_result_count.message': 'No results count found',
  'table.notes': 'Notes',
  'table.optional_not_required.label': 'OPTIONAL (not required)',
  'table.overall_compatibility.label': 'Overall Compatibility',
  'table.point_of_contact.label': 'Point of contact',
  'table.show_older_versions.label': 'Show older versions',
  'table.software_name.label': 'Software Version',
  'table.submission_date.label': 'Submission Date',
  'table.recommended_not_required.label': 'RECOMMENDED (not required)',
  'table.rejected.label': 'Rejected',
  'table.result.label': ' result',
  'table.result.plural.label': ' results',
  'table.requirement_specification.label': 'Requirement Specification',
  'table.requirement_specification_compliance.label':
    'Requirement Specification Compliance',
  'table.website.label': 'Website',

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
