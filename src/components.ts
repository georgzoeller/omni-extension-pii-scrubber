import { SyncRedactor } from 'redact-pii'
import { OAIBaseComponent, WorkerContext, OmniComponentMacroTypes } from 'omni-sockets';

const NS_ONMI = 'compliance';

let component = OAIBaseComponent
  .create(NS_ONMI, "redactPII")
  .fromScratch()
  .set('title', 'PII Redaction')
  .set('category', 'Compliance')
  .set('description', 'Redact Personal Information from text')
  .setMethod('X-CUSTOM')
  .setMeta({
    source: {
      summary: 'A PII redactor built using the solvvy/redact-pii library, implementing regex based PII reduction along with support for Google Cloud DLP',
      links: {
        'What is PII?': 'https://www.cloudflare.com/learning/privacy/what-is-pii/',
        'redact-pii github': 'https://github.com/solvvy/redact-pii',
        'google cloud DLP': 'https://cloud.google.com/dlp/',
        'Solvy': 'https://www.solvvy.com/'
      }
    }
  });

// Adding input
const inputs = [
  { name: 'text', type: 'string', description: 'The Text to Scan', customSocket: 'text' },
  { name: 'url', type: 'boolean', defaultValue: true },
  { name: 'names', type: 'boolean', defaultValue: false },
  { name: 'emailAddress', type: 'boolean', defaultValue: true },
  { name: 'credentials', type: 'boolean', defaultValue: true },
  { name: 'digits', type: 'boolean', defaultValue: false },
  { name: 'creditCardNumber', type: 'boolean', defaultValue: true },
  { name: 'streetAddress', type: 'boolean', defaultValue: true },
  { name: 'zipcode', type: 'boolean', defaultValue: true },
  { name: 'ipAddress', type: 'boolean', defaultValue: true },
  { name: 'usSocialSecurityNumber', type: 'boolean', defaultValue: true },
];

inputs.forEach(({ name, type, customSocket, description, defaultValue }) => {
  component.addInput(
    component.createInput(name, type, customSocket)
      .set('description', description || '')
      .setDefault(defaultValue)
      .toOmniIO()
  );
});

// Adding output
component.addOutput(
  component.createOutput('text', 'string', 'text')
    .set('description', 'Redacted Text')
    .toOmniIO()
  )

// Assuming _exec function is provided later
.setMacro(OmniComponentMacroTypes.EXEC, (payload: any, ctx: WorkerContext) => {
  const redactor = new SyncRedactor(  {
    builtInRedactors: {
      names: {
        enabled: payload.names,
        replaceWith: "PII_REDACTED: Name"
      },
      url:
      {
        enabled: payload.url,
        replaceWith: "PII_REDACTED: Url"
      },
      digits:
      {
        enabled: payload.digits,
        replaceWith: "PII_REDACTED: Digits"
      },
      emailAddress:
      {
        enabled: payload.emails,
        replaceWith: "PII_REDACTED: Email"
      },
      streetAddress:
      {
        enabled: payload.streetAddress,
        replaceWith: "PII_REDACTED: Address"
      },
      creditCardNumber:
      {
        enabled: payload.creditCardNumber,
        replaceWith: "PII_REDACTED: Credit Card"
      },
      ipAddress:
      {
        enabled: payload.ipAddress,
        replaceWith: "PII_REDACTED: ZIP CODE"
      },
      usSocialSecurityNumber:
      {
        enabled: payload.usSocialSecurityNumber,
        replaceWith: "PII_REDACTED: SSN"
      },
      zipcode:
      {
        enabled: payload.zipcode,
        replaceWith: "PII_REDACTED: ZIP CODE"
    }

    }
  });

  if (payload.text != null && typeof(payload.text) === 'string')
  {
    return {text: redactor.redact(payload.text)}
  }
  return {text: payload.text}
})

const RedactPIIComponent = component.toJSON()
let components = [RedactPIIComponent]

export default () =>
{
  return {
    blocks: components,
    patches: []
  }
}
