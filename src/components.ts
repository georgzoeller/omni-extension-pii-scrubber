import { zip } from 'lodash-es';
import { SyncRedactor } from 'redact-pii'
import { creditCardNumber, streetAddress } from 'redact-pii/lib/built-ins/simple-regexp-patterns';


const PIIScrubberComponentDef =
  {
    schema:
    {
      "tags": ['default'],
      "componentKey": "redactPII",
      "operation": {
        "operationId": "redactPII",
        "schema": {
          "title": "Redact PII",
          "type": "object",
          required:['text'],
          "properties": {
            "text": {
              "title": "Text",
              "type": "string",
              "x-type": "text",
              "description": "A string"
            },
            "url": {
              "title": "Redact Urls",
              "type": "boolean",
              "default": true,
            },
            "names": {
              "title": "Redact Names",
              "type": "boolean",
              "default": false,
            },
            "emailAddress": {
              "title": "Redact Emails",
              "type": "boolean",
              "default": true,
            },
            "credentials": {
              "title": "Redact Credentials",
              "type": "boolean",
              "default": true,
            },
            "digits": {
              "title": "Redact Credentials",
              "type": "boolean",
              "default": false,
            },
            "creditCardNumber":
            {
              "title": "Redact CreditCard",
              "type": "boolean",
              "default": true,
            },
            "streetAddress":
            {
              "title": "Redact Address",
              "type": "boolean",
              "default": true,
            },
            "zipcode":
            {
              "title": "Redact ZipCode",
              "type": "boolean",
              "default": true,
            },
            "ipAddress":
            {
              "title": "Redact IpAddress",
              "type": "boolean",
              "default": true,
            },
            "usSocialSecurityNumber":
            {
              "title": "Redact SSN",
              "type": "boolean",
              "default": true,
            }

          },
        },
        "responseTypes": {
          "200": {
            "schema": {
              "title": "Text",
              "required": [
                "text"
              ],
              "type": "string",
              "properties": {
                "text": {
                  "title": "Redacted Text",
                  "type": "string",
                  "description": "A string"
                },
              },
            },
            "contentType": "application/json"
          },
        },
        "method": "X-CUSTOM"
      },
      patch:
      {
        "title": "PII Redaction",
        "category": "Compliance",
        "summary": "Redact Persional Information from text",
        "meta":
        {
          "source":
          {
            "summary": "A PII redactor built using the solvvy/redact-pii library, implementing regex based PII reduction along with support for Google Cloud DLP",
            links:
            {
              "What is PII?": "https://www.cloudflare.com/learning/privacy/what-is-pii/",
              "redact-pii github": "https://github.com/solvvy/redact-pii",
              "google cloud DLP": "https://cloud.google.com/dlp/",
              "Solvy": "https://www.solvvy.com/"
            }
          }
        }

      }
    },
    functions: {
      _exec: async (payload, ctx) =>
      {

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
          payload.text = redactor.redact(payload.text)
        }
        return payload
      }
    }
  }


let components = [PIIScrubberComponentDef]


export default (FactoryFn: any) =>
{
  return components.map((c) => FactoryFn(c.schema, c.functions))
}
