/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

import { SyncRedactor } from 'redact-pii'
import CreateComponents from './components'


const redactor = new SyncRedactor(  {
  builtInRedactors: {
    names: {
      enabled: false
    },
    url:
    {
      enabled: false
    },
    digits:
    {
      enabled: false
    },
    emailAddress:
    {
      enabled: true,
      replaceWith: "PII_REDACTED: Email"
    },
    streetAddress:
    {
      enabled: true,
      replaceWith: "PII_REDACTED: Address"
    },
    creditCardNumber:
    {
      enabled: true,
      replaceWith: "PII_REDACTED: Credit Card"
    },
    ipAddress:
    {
      enabled: true,
      replaceWith: "PII_REDACTED: ZIP CODE"
    },
    usSocialSecurityNumber:
    {
      enabled: true,
      replaceWith: "PII_REDACTED: SSN"
    },
    zipcode:
    {
      enabled: false,
      replaceWith: "PII_REDACTED: ZIP CODE"
  }
  }
});




const extensionHooks = {

  // intercept direct entry into a chat input component
  'component:x-input': function(extension, ctx, payload)
  {

      console.log('job_pre_start pii scrubber', payload)

    if (payload.text != null && typeof(payload.text) === 'string')
    {
      payload.text = redactor.redact(payload.text);
    }
  },

  // Intercept chat input
  'job_pre_start': function(extension, ctx, workflow, workflow_context, actions)
  {
    console.log('job_pre_start pii scrubber', workflow_context.args)

    if(workflow_context.args && workflow_context.args.text != null)
    {
      workflow_context.args.text = redactor.redact(workflow_context.args.text);
    }

  }

}

export default {hooks: extensionHooks, createComponents: CreateComponents}



