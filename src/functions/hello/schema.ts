export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    account: { type: 'string' },
    region: { type: 'string' },
    detail: {},
    "detail-type": { type: 'string' },
    source: { type: 'string' },
    time: { type: 'string' },
    id: { type: 'string' },
    resources: { type: "object" }
  },
  required: ['name']
} as const;
