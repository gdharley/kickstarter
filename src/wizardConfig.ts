// This file defines the wizard steps and questions for the application.
// Nested questions and visibility conditions can be configured here.

export const wizardConfig = [
  {
    id: 'introduction',
    title: 'Introduction',
    description: 'Welcome to the Process Automation Wizard. This tool will guide you through a series of questions to collect technical and platform requirements for your automation project. You can import a previous session to continue where you left off.',
    type: 'info',
    options: [],
    resources: [
      { label: 'Kickstart Documentation', url: 'https://your-kickstart-docs.example.com' }
    ]
  },
  {
    id: 'platform-strategy',
    title: 'Platform Strategy',
    description: 'How will <span style="color: #e74c3c">Flowable</span> be used in your environment?',
    type: 'single-select',
    options: [
      {
        value: 'centralized',
        label: 'Centralized Automation Platform',
        description: 'One Flowable instance serving multiple business units.'
      },
      {
        value: 'decentralized',
        label: 'Decentralized business unit specific instances',
        description: 'Each business unit has its own Flowable instance.'
      }
    ],
    resources: [
      { label: 'Flowable Platform Strategy', url: 'https://documentation.flowable.com/latest/platform/strategy' }
    ]
  },
  {
    id: 'features',
    title: 'Features to be Used',
    description: 'Select all features you plan to use in your Flowable implementation.',
    type: 'multi-select',
    options: [
      {
        value: 'ai-agents',
        label: 'AI Agents',
        description: "Flowable's agentic services"
      },
      {
        value: 'integrations',
        label: 'Integrations',
        description: 'REST APIs, Java Beans, Scripting'
      },
      {
        value: 'external-workers',
        label: 'External Workers',
        description: 'External task applications'
      },
      {
        value: 'channels-events',
        label: 'Channels and Events',
        description: 'Queue integration for Kafka, JMS, RabbitMQ, Email'
      }
    ],
    resources: [
      { label: 'Flowable Features', url: 'https://documentation.flowable.com/latest/features/' },
      { label: 'Integration Guide', url: 'https://documentation.flowable.com/latest/integration/' }
    ]
  },
  {
    id: 'deployment-type',
    title: 'Deployment Type',
    description: 'Where will Flowable be deployed?',
    type: 'single-select',
    options: [
      {
        value: 'on-premise',
        label: 'On premise deployment (Self Hosted)',
        description: 'Flowable is deployed in your own environment either as a containerized application or in a virtual machine.'
      },
      {
        value: 'cloud-shared',
        label: 'Cloud shared (SAAS)',
        description: 'A multi tenant environment hosted by Flowable.'
      }
    ],
    resources: [
      { label: 'Deployment Options', url: 'https://documentation.flowable.com/latest/deployment/' }
    ]
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    description: 'Select your infrastructure platform.',
    type: 'single-select',
    options: [
      {
        value: 'kubernetes',
        label: 'Kubernetes',
        description: 'An Open Source containerization platform'
      },
      {
        value: 'openshift',
        label: 'OpenShift',
        description: 'A containerized platform hosted by Red Hat'
      },
      {
        value: 'on-premise-vm',
        label: 'On Premise(VM)',
        description: 'A traditional Virtual Machine'
      }
    ],
    visibleIf: [
      { stepId: 'deployment-type', value: 'on-premise' },
      // You can add more conditions here, e.g.:
      // { stepId: 'features', values: ['integrations', 'ai-agents'] }
    ],
    resources: [
      { label: 'Infrastructure Overview', url: 'https://documentation.flowable.com/latest/infrastructure/' }
    ]
  },
  {
    id: 'summary',
    title: 'Summary & Export',
    description: 'Review your answers below. You can export your results as JSON or Markdown for documentation or further processing.',
    type: 'summary',
    options: [],
    resources: [
      { label: 'Export & Summary Help', url: 'https://documentation.flowable.com/latest/export/' }
    ]
  }
];
