import { CompanyAPI, APIStatus } from './types';

export const API_CONFIG: CompanyAPI[] = [
  {
    id: '1',
    name: 'Stripe Connect',
    logo: 'https://picsum.photos/seed/stripe/400/400',
    description: 'Global payment processing and financial infrastructure for the internet.',
    category: 'Payments',
    tags: ['plugins', 'addons', 'fintech'],
    compatibility: 'WordPress 5.8+, PHP 7.4+',
    version: 'v3.2.0',
    availableVersions: ['v3.2.0', 'v3.1.5', 'v3.0.0'],
    status: APIStatus.IDLE,
    settingsConfig: [
      {
        id: 'general',
        label: 'General',
        icon: 'globe',
        fields: [
          { key: 'endpoint', label: 'API Endpoint', type: 'text', defaultValue: 'https://api.stripe.com/v1', icon: 'globe' },
          { key: 'environment', label: 'Environment', type: 'select', defaultValue: 'development', options: ['development', 'production'], icon: 'server' }
        ]
      },
      {
        id: 'auth',
        label: 'Authentication',
        icon: 'shield',
        fields: [
          { 
            key: 'apiKey', 
            label: 'API Key', 
            type: 'password', 
            defaultValue: '', 
            icon: 'key', 
            helpText: 'Your Stripe secret key',
            instruction: 'Find your API keys in the Stripe Dashboard under Developers > API keys. Use the "Secret key" for this field.'
          },
          { key: 'token', label: 'Access Token', type: 'text', defaultValue: '', icon: 'shield' }
        ]
      },
      {
        id: 'advanced',
        label: 'Advanced',
        icon: 'cpu',
        fields: [
          { key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 30000, icon: 'terminal' },
          { key: 'retries', label: 'Max Retries', type: 'number', defaultValue: 3, icon: 'layers' },
          { key: 'logging', label: 'Verbose Logging', type: 'toggle', defaultValue: true, icon: 'activity', helpText: 'Log detailed request and response data' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Twilio Messaging',
    logo: 'https://picsum.photos/seed/twilio/400/400',
    description: 'Programmable SMS, Voice, and Video communication platform.',
    category: 'Communication',
    tags: ['plugins', 'houzez plugin', 'sms'],
    compatibility: 'Houzez 2.4+, Twilio SDK v5',
    version: 'v5.1.2',
    availableVersions: ['v5.1.2', 'v5.0.0'],
    status: APIStatus.IDLE,
    settingsConfig: [
      {
        id: 'general',
        label: 'General',
        icon: 'globe',
        fields: [
          { key: 'endpoint', label: 'API Endpoint', type: 'text', defaultValue: 'https://api.twilio.com/2010-04-01', icon: 'globe' }
        ]
      },
      {
        id: 'auth',
        label: 'Authentication',
        icon: 'shield',
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'text', defaultValue: '', icon: 'key' },
          { 
            key: 'authToken', 
            label: 'Auth Token', 
            type: 'password', 
            defaultValue: '', 
            icon: 'shield',
            instruction: 'Log in to the Twilio Console and find your Auth Token in the "Account Info" section of the Dashboard.'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'AWS S3 Storage',
    logo: 'https://picsum.photos/seed/aws/400/400',
    description: 'Scalable object storage for data backup, archival, and analytics.',
    category: 'Infrastructure',
    tags: ['addons', 'cloud', 'storage'],
    compatibility: 'AWS SDK v3, Node.js 14+',
    version: 'v2.0.0',
    availableVersions: ['v2.0.0', 'v1.9.5'],
    status: APIStatus.IDLE,
    settingsConfig: [
      {
        id: 'general',
        label: 'General',
        icon: 'globe',
        fields: [
          { key: 'region', label: 'AWS Region', type: 'select', defaultValue: 'us-east-1', options: ['us-east-1', 'us-west-2', 'eu-west-1'], icon: 'globe' },
          { key: 'bucket', label: 'S3 Bucket Name', type: 'text', defaultValue: '', icon: 'layers' }
        ]
      },
      {
        id: 'auth',
        label: 'Credentials',
        icon: 'shield',
        fields: [
          { 
            key: 'accessKey', 
            label: 'Access Key ID', 
            type: 'text', 
            defaultValue: '', 
            icon: 'key',
            instruction: 'Create an IAM user in the AWS Console and attach the "AmazonS3FullAccess" policy. Copy the Access Key ID here.'
          },
          { 
            key: 'secretKey', 
            label: 'Secret Access Key', 
            type: 'password', 
            defaultValue: '', 
            icon: 'shield',
            instruction: 'The Secret Access Key is only shown once when you create the IAM user. If you lost it, you must create a new access key.'
          }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'AWS S3 Storage Test',
    logo: 'https://picsum.photos/seed/aws/400/400',
    description: 'Scalable object storage for data backup, archival, and analytics.',
    category: 'Infrastructure',
    tags: ['theme', 'cloud', 'storage'],
    compatibility: 'AWS SDK v3, Node.js 14+',
    version: 'v2.0.0',
    availableVersions: ['v2.0.0', 'v1.9.5'],
    status: APIStatus.IDLE,
    settingsConfig: [
      {
        id: 'general',
        label: 'General',
        icon: 'globe',
        fields: [
          { key: 'region', label: 'AWS Region', type: 'select', defaultValue: 'us-east-1', options: ['us-east-1', 'us-west-2', 'eu-west-1'], icon: 'globe' },
          { key: 'bucket', label: 'S3 Bucket Name', type: 'text', defaultValue: '', icon: 'layers' }
        ]
      },
      {
        id: 'auth',
        label: 'Credentials',
        icon: 'shield',
        fields: [
          { 
            key: 'accessKey', 
            label: 'Access Key ID', 
            type: 'text', 
            defaultValue: '', 
            icon: 'key',
            instruction: 'Create an IAM user in the AWS Console and attach the "AmazonS3FullAccess" policy. Copy the Access Key ID here.'
          },
          { 
            key: 'secretKey', 
            label: 'Secret Access Key', 
            type: 'password', 
            defaultValue: '', 
            icon: 'shield',
            instruction: 'The Secret Access Key is only shown once when you create the IAM user. If you lost it, you must create a new access key.'
          }
        ]
      }
    ]
  }
];
