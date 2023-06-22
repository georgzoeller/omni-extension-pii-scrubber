import { SyncRedactor } from 'redact-pii'
import CreateComponents from './components'


const redactor = new SyncRedactor(  {
  builtInRedactors: {
    names: {
      enabled: false
    }
  }
});


const debug = (text)=>
{
  console.log('=================>', text)
}



const extensionHooks = {

  // intercept direct entry into a chat input component
  'component:x-input': function(ctx, payload)
  {

      console.log('job_pre_start pii scrubber', payload)

    if (payload.text != null && typeof(payload.text) === 'string')
    {
      payload.text = redactor.redact(payload.text);
    }
  },

  // Intercept chat input
  'job_pre_start': function(ctx, workflow, workflow_context, actions)
  {
    console.log('job_pre_start pii scrubber', workflow_context.args)

    if(workflow_context.args && workflow_context.args.text != null)
    {
      workflow_context.args.text = redactor.redact(workflow_context.args.text);
    }

  }

}

export default {hooks: extensionHooks, createComponents: CreateComponents}



