import { SyncRedactor } from 'redact-pii'


const PIIScrubberComponentDef =
  {
    schema:
    {
      "namespace": "omni-extension-pii-scrubber",
      "tags": ['default'],

      "componentKey": "redactPII",
      "apiKey": "redactPII",
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
        "title": "Redact PII",
        "description": "A component to redact personally identifiable information (PII) from text",
        "meta":
        {
          "source":
          {
            "description": "A text field pii redactorBuilt using the solvvy/redact-pii library, implementing regex based PII reduction along with support for Google Cloud DLP",
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
      _exec: async (ctx, payload) =>
      {

        const redactor = new SyncRedactor(  {
          builtInRedactors: {
            names: {
              enabled: false
            }
          }
        });


        payload.text = redactor.redact(payload.text)
      }
    }
  }


let components = [PIIScrubberComponentDef]


export default (FactoryFn: any) =>
{
  return components.map((c) => FactoryFn(c.schema, c.functions))
}
